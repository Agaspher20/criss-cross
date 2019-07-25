package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import java.util.concurrent.ConcurrentHashMap
import java.util.*

class GameStorage {
    private val usersDictionary = ConcurrentHashMap<String, String>()

    private var lastGameId = 0
    private val gamesDictionary = ConcurrentHashMap<Int, Game>()
    private val gameDetailsDictionary = ConcurrentHashMap<Int, StoredGameDetails>()
    private val gamesMovesSubscriptionsDictionary = ConcurrentHashMap<Int, ConcurrentHashMap<WebSocketSession, WebSocketSession>>()
    private val webSocketToGameDictionary = ConcurrentHashMap<WebSocketSession, Int>()

    fun setUserName(userId: String, userName: String) {
        usersDictionary[userId] = userName
    }

    fun getUser(userId: String): User {
        return User(userId, usersDictionary[userId])
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

    fun getGameDetails(id: Int): StoredGameDetails? = if (!gamesDictionary.containsKey(id)) {
        null
    } else {
        gameDetailsDictionary.getOrPut(id, {
            StoredGameDetails(
                "X",
                ConcurrentHashMap()
            )
        })
    }

    fun subscribeGame(gameId: Int, session: WebSocketSession) {
        val subscribers = gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() })
        subscribers[session] = session
        webSocketToGameDictionary[session] = gameId
    }

    fun unsubscribeGame(gameId: Int, session: WebSocketSession) {
        val subscribers = gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() })
        subscribers.remove(session)
    }

    fun memberLeft(session: WebSocketSession) {
        val gameId = webSocketToGameDictionary.getOrDefault(session, -1)
        webSocketToGameDictionary.remove(session)
        println("removing member $gameId")
        if (gameId > -1) {
            val subscriptions = gamesMovesSubscriptionsDictionary.getOrElse(gameId, { ConcurrentHashMap() })
            subscriptions.remove(session)
            println("removed game subscription")
        }
        println("removed member")
    }

    fun getSubscribers(gameId: Int): Collection<WebSocketSession> {
        return gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() }).values
    }
}
