package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import io.ktor.util.generateNonce
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.collections.ArrayList
import kotlin.collections.HashMap
import kotlin.concurrent.read
import kotlin.concurrent.write

class GameStorage {
    private val usersDictionary = ConcurrentHashMap<String, String>()

    private val gamesDictionary = ConcurrentHashMap<String, Game>()
    private val gameDetailsDictionary = ConcurrentHashMap<Game, StoredGameDetails>()
    private val gameLocks = ConcurrentHashMap<Game, ReentrantReadWriteLock>()
    private val gamesMovesSubscriptionsDictionary = ConcurrentHashMap<String, ConcurrentHashMap<WebSocketSession, WebSocketSession>>()
    private val webSocketToGameDictionary = ConcurrentHashMap<WebSocketSession, String>()
    private val participants = ArrayList<WebSocketSession>()
    private val participantsLock = ReentrantReadWriteLock(false)

    fun setUserName(userId: String, userName: String) {
        usersDictionary[userId] = userName
    }

    fun getUser(userId: String): User {
        return User(userId, usersDictionary[userId])
    }

    fun registerUser(session: WebSocketSession) = participantsLock.write {
        this.participants.add(session)
    }

    fun unregisterUser(session: WebSocketSession) = participantsLock.write {
        this.participants.remove(session)
    }

    fun getAllWebSockets(): List<WebSocketSession> = participantsLock.read {
        this.participants.toList()
    }

    fun getGames(): Enumeration<Game> = gamesDictionary.elements()

    fun getGame(gameId: String): Game? = gamesDictionary.getOrElse(gameId, { null })

    fun createGame(name: String): Game {
        val gameId = generateNonce()
        val game = Game(gameId, name, Date().time)
        gamesDictionary[gameId] = game

        return game
    }

    fun getGameDetails(game: Game): StoredGameDetails = gameDetailsDictionary.getOrPut(game, {
        StoredGameDetails(
            "X",
            HashMap(),
            HashMap()
        )
    })

    fun getGameLock(game: Game): ReentrantReadWriteLock = gameLocks.getOrPut(game, { ReentrantReadWriteLock() })

    fun putGameDetails(game: Game, details: StoredGameDetails) {
        gameDetailsDictionary[game] = details
    }

    fun saveGameSubscription(gameId: String, session: WebSocketSession) {
        val subscribers = gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() })
        subscribers[session] = session
        webSocketToGameDictionary[session] = gameId
    }

    fun removeGameSubscriptionById(gameId: String, session: WebSocketSession) {
        val subscribers = gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() })
        subscribers.remove(session)
        webSocketToGameDictionary.remove(session)
    }

    fun removeGameSubscriptionBySession(session: WebSocketSession): String? {
        val gameId = webSocketToGameDictionary[session]

        if (gameId != null) {
            removeGameSubscriptionById(gameId, session)
        }

        return gameId
    }

    fun getSubscribers(gameId: String): Collection<WebSocketSession> {
        return gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() }).values
    }
}
