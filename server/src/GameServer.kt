package com.crissCrossServer

import kotlin.Pair
import java.util.concurrent.ConcurrentHashMap
import java.util.*
import kotlin.collections.ArrayList

data class Game(val id: Int, val name: String)
data class GameDetails(
    val stepsCount: Int,
    val nextSymbol: String,
    val cells: ArrayList<Pair<Int, String>>,
    val lastMoveId: String? = null,
    val winnerSymbol: String? = null)
data class User(val id: String, val name: String?)

class GameServer {
    private val usersDictionary = ConcurrentHashMap<String, String>()

    private var lastGameId = 0
    private val gamesDictionary = ConcurrentHashMap<Int, Game>()
    private val gameDetailsDictionary = ConcurrentHashMap<Int, GameDetails>()

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

    fun getGameDetails(id: Int): GameDetails? {
        if (!gamesDictionary.containsKey(id)) {
            return null
        }

        return gameDetailsDictionary.getOrPut(id, {
            GameDetails(
                0,
                "X",
                ArrayList<Pair<Int, String>>(0))
        })
    }
}
