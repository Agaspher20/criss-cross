package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import java.util.concurrent.ConcurrentHashMap
import java.util.*
import kotlin.collections.ArrayList

data class Game(val id: Int, val name: String)
data class GameDetails(
    val stepsCount: Int,
    val nextSymbol: String,
    val moves: ArrayList<StoredGameMove>,
    val lastMoveId: String? = null,
    val winnerSymbol: String? = null)
data class GameMove(
    val gameId: Int,
    val userId: String,
    val cellIndex: Int,
    val symbol: String
)
data class StoredGameMove(
    val userName: String,
    val cellIndex: Int,
    val symbol: String
)
data class User(val id: String, val name: String?)

class GameServer {
    private val usersDictionary = ConcurrentHashMap<String, String>()

    private var lastGameId = 0
    private val gamesDictionary = ConcurrentHashMap<Int, Game>()
    private val gameDetailsDictionary = ConcurrentHashMap<Int, GameDetails>()
    private val gamesMovesSubscriptionsDictionary = ConcurrentHashMap<Int, ArrayList<WebSocketSession>>()

    fun setUserName(session: GameSession, userName: String) {
        usersDictionary[session.id] = userName
    }

    fun getUser(session: GameSession): User {
        return User(session.id, usersDictionary[session.id])
    }

    fun getAllGames(): Enumeration<Game> {
        return gamesDictionary.elements()
    }

    fun createGame(name: String): Game {
        val id = lastGameId
        ++lastGameId

        val game = Game(id, name)
        gamesDictionary[id] = game

        return game
    }

    fun getGameDetails(id: Int): GameDetails? = if (!gamesDictionary.containsKey(id)) {
        null
    } else {
        gameDetailsDictionary.getOrPut(id, {
            GameDetails(
                0,
                "X",
                ArrayList(0))
        })
    }

    fun moveGame(move: GameMove): GameMove? {
        val gameDetails = getGameDetails(move.gameId)

        if (gameDetails == null) {
            return null
        }

        val storedMove = StoredGameMove(usersDictionary.getOrDefault(move.userId, "<Anonymous>"), move.cellIndex, move.symbol)
        gameDetails.moves.add(storedMove)

        return move
    }

    fun subscribeGame(gameId: Int, session: WebSocketSession) {
        val subscribers = gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ArrayList() })
        subscribers.add(session)
    }

    fun getSubscribers(gameId: Int): ArrayList<WebSocketSession> {
        return gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ArrayList() })
    }
}
