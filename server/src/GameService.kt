package com.crissCrossServer

import kotlin.concurrent.read
import kotlin.concurrent.write

class GameService(private val parameters: GameParameters, private val storage: GameStorage) {
    fun loadGame(id: String): GameDetails? {
        val game = this.storage.getGame(id)

        return if (game == null) {
            null
        } else {
            val gameLock = this.storage.getGameLock(game)
            gameLock.read {
                val storedGame = this.storage.getGameDetails(game)
                GameDetails(
                    storedGame.nextSymbol,
                    storedGame.moves.values.toList(),
                    storedGame.lastMoveId,
                    storedGame.winnerSymbol,
                    storedGame.winnerName)
            }
        }
    }

    fun moveGame(move: GameMove): Pair<GameMove?, String?> {
        val game = this.storage.getGame(move.gameId)

        if (game == null) {
            return Pair(null, null)
        }

        val gameLock = this.storage.getGameLock(game)
        val storedMove = StoredGameMove(move.userId, move.cellIndex, move.symbol)

        return gameLock.write {
            val gameDetails = this.storage.getGameDetails(game)
            if (!canSetSymbol(move, gameDetails)) {
                return Pair(null, null)
            }

            val nextMoves = HashMap(gameDetails.moves)
            nextMoves[storedMove.cellIndex] = storedMove
            val winnerSymbol = calculateWinner(
                move.symbol,
                nextMoves,
                move.cellIndex,
                parameters
            )
            val resultDetails = StoredGameDetails(
                if (move.symbol == "X") "O" else "X",
                nextMoves,
                move.userId,
                winnerSymbol,
                if (winnerSymbol != null) this.storage.getUser(move.userId).name else null
            )

            this.storage.putGameDetails(move.gameId, resultDetails)

            return Pair(move, resultDetails.winnerName)
        }
    }

    private fun canSetSymbol(move: GameMove, details: StoredGameDetails): Boolean {
        return details.moves[move.cellIndex] == null
                && details.nextSymbol == move.symbol
                && details.lastMoveId != move.userId
                && details.winnerSymbol == null
    }
}


private fun getPositionByIndex(index: Int, sideSize: Int) = Position(
    index/sideSize,
    index%sideSize
)

private fun calculateIndex(position: Position, sideSize: Int): Int {
    val (rowIndex, columnIndex) = position
    return rowIndex*sideSize + columnIndex
}

private val moveLaws: Array<Array<(Position) -> Position>> = arrayOf(
    arrayOf(// horizontal
        { p -> Position(p.rowIndex, p.columnIndex + 1) },
        { p -> Position(p.rowIndex, p.columnIndex - 1) }
    ),
    arrayOf(// vertical
        { p -> Position(p.rowIndex + 1, p.columnIndex ) },
        { p -> Position(p.rowIndex - 1, p.columnIndex ) }
    ),
    arrayOf(// main diagonal
        { p -> Position(p.rowIndex + 1, p.columnIndex + 1) },
        { p -> Position(p.rowIndex - 1, p.columnIndex - 1) }
    ),
    arrayOf(// diagonal
        { p -> Position(p.rowIndex - 1, p.columnIndex + 1) },
        { p -> Position(p.rowIndex + 1, p.columnIndex - 1) }
    )
)

private fun calculateWinner(
    symbol: String,
    cells: HashMap<Int, StoredGameMove>,
    startIndex: Int,
    parameters: GameParameters
): String? {
    val position = getPositionByIndex(startIndex, parameters.sideSize)

    moveLaws.forEach { moves ->
        var lineSymbolsCount = 1
        moves.forEach { move ->
            lineSymbolsCount = calculateSide(
                lineSymbolsCount,
                symbol,
                move,
                position,
                cells,
                parameters)
            if (lineSymbolsCount == parameters.symbolsToWin) {
                return symbol
            }
        }
    }

    return null
}

private fun calculateSide(
    startCount: Int,
    symbol: String,
    move: (Position) -> Position,
    position: Position,
    cells: HashMap<Int, StoredGameMove>,
    gameParameters: GameParameters
): Int {
    val (symbolsToWin, sideSize) = gameParameters
    var currentPosition: Position = move(position)
    var symbolsCount = startCount

    while (positionInSquareBounds(currentPosition, sideSize) && symbolsCount < symbolsToWin) {
        val currentIndex = calculateIndex(currentPosition, sideSize)
        val currentCell = cells[currentIndex]

        if (currentCell != null && currentCell.symbol == symbol) {
            ++symbolsCount
        } else {
            break
        }

        currentPosition = move(currentPosition)
    }

    return symbolsCount
}

private fun positionInSquareBounds(position: Position, sideSize: Int): Boolean {
    val (rowIndex, columnIndex) = position
    return columnIndex in 0 until sideSize && rowIndex in 0 until sideSize
}
