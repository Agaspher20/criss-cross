package com.crissCrossServer

class GameService {
    fun moveGame(move: GameMove, gameDetails: StoredGameDetails?): GameMove? {
        if (gameDetails == null || !canSetSymbol(move, gameDetails)) {
            return null
        }

        val storedMove = StoredGameMove(move.userId, move.cellIndex, move.symbol)
        gameDetails.moves[storedMove.cellIndex] = storedMove
        gameDetails.nextSymbol = if (move.symbol == "X") "O" else "X"
        gameDetails.lastMoveId = move.userId

        return move
    }

    private fun canSetSymbol(move: GameMove, details: StoredGameDetails): Boolean {
        return details.moves[move.cellIndex] == null
                && details.nextSymbol == move.symbol
                && details.lastMoveId != move.userId
                && details.winnerSymbol == null
    }
}
