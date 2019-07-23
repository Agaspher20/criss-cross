package com.crissCrossServer

import java.util.concurrent.ConcurrentHashMap
import java.util.*

data class Game(val id: Int, val name: String)

class GameServer {
    private val usersDictionary = ConcurrentHashMap<String, String>()

    private var lastGameId = 0
    private val gamesDictionary = ConcurrentHashMap<Int, Game>()

    fun setUserName(session: GameSession, userName: String) {
        usersDictionary[session.id] = userName
    }

    fun getUserName(session: GameSession): String? = usersDictionary[session.id]

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
}
