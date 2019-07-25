package com.crissCrossServer

import java.util.concurrent.ConcurrentHashMap

class GameService(private val storage: GameStorage) {
    fun moveGame(move: GameMove): Pair<GameMove?, String?> {
        val gameDetails = this.storage.getGameDetails(move.gameId)
        if (gameDetails == null || !canSetSymbol(move, gameDetails)) {
            return Pair(null, null)
        }

        val storedMove = StoredGameMove(move.userId, move.cellIndex, move.symbol)
        gameDetails.moves[storedMove.cellIndex] = storedMove
        gameDetails.nextSymbol = if (move.symbol == "X") "O" else "X"
        gameDetails.lastMoveId = move.userId
        gameDetails.winnerSymbol = calculateWinner(
            move.symbol,
            gameDetails.moves,
            move.cellIndex,
            GameParameters(3, 4)
        )

        if (gameDetails.winnerSymbol != null) {
            gameDetails.winnerName = this.storage.getUser(move.userId).name
        }

        return Pair(move, gameDetails.winnerName)
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
    cells: ConcurrentHashMap<Int, StoredGameMove>,
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
    cells: ConcurrentHashMap<Int, StoredGameMove>,
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
