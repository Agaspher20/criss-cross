package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.collections.ArrayList

class GameStorage {
    private val usersDictionary = ConcurrentHashMap<String, String>()

    private val gamesDictionary = ConcurrentHashMap<String, Game>()
    private val gameDetailsDictionary = ConcurrentHashMap<String, StoredGameDetails>()
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

    fun registerUser(session: WebSocketSession) {
        participantsLock.writeLock().lock()

        try {
            this.participants.add(session)
        } finally {
            participantsLock.writeLock().unlock()
        }
    }

    fun unregisterUser(session: WebSocketSession) {
        participantsLock.writeLock().lock()

        try {
            this.participants.remove(session)
        } finally {
            participantsLock.writeLock().unlock()
        }
    }

    fun getAllWebSockets(): List<WebSocketSession> {
        participantsLock.readLock().lock()

        try {
            return this.participants.toList()
        } finally {
            participantsLock.readLock().unlock()
        }
    }

    fun getGames(): Enumeration<Game> = gamesDictionary.elements()

    fun getGame(gameId: String): Game = gamesDictionary.getValue(gameId)

    fun putGame(game: Game) {
        gamesDictionary[game.id] = game
    }

    fun getGameDetails(id: String): StoredGameDetails? = if (!gamesDictionary.containsKey(id)) {
        null
    } else {
        gameDetailsDictionary.getOrPut(id, {
            StoredGameDetails(
                "X",
                ConcurrentHashMap(),
                ReentrantReadWriteLock(false)
            )
        })
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
