package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.generateNonce
import java.lang.Exception
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantReadWriteLock

class GameStorage {
    private val usersDictionary = ConcurrentHashMap<String, String>()

    private val gamesDictionary = ConcurrentHashMap<String, Game>()
    private val gameDetailsDictionary = ConcurrentHashMap<String, StoredGameDetails>()
    private val gamesMovesSubscriptionsDictionary = ConcurrentHashMap<String, ConcurrentHashMap<WebSocketSession, WebSocketSession>>()
    private val webSocketToGameDictionary = ConcurrentHashMap<WebSocketSession, String>()
    private val participants = ArrayList<WebSocketSession>()
    private val gameListLock = ReentrantReadWriteLock(false)
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

    fun getAllGames(): List<Game> {
        gameListLock.readLock().lock()

        return try {
            gamesDictionary.elements().toList()
        } catch (exc: Exception) {
            listOf()
        } finally {
            gameListLock.readLock().unlock()
        }
    }

    @KtorExperimentalAPI
    fun createGame(name: String): Game {
        gameListLock.writeLock().lock()

        try {
            val id = generateNonce()

            val game = Game(id, name)
            gamesDictionary[id] = game

            return game
        } finally {
            gameListLock.writeLock().unlock()
        }
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

    fun subscribeGame(gameId: String, session: WebSocketSession) {
        val subscribers = gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() })
        subscribers[session] = session
        webSocketToGameDictionary[session] = gameId
    }

    fun unsubscribeGame(gameId: String, session: WebSocketSession) {
        val subscribers = gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() })
        subscribers.remove(session)
    }

    fun memberLeft(session: WebSocketSession) {
        val gameId = webSocketToGameDictionary[session]
        webSocketToGameDictionary.remove(session)
        println("removing member $gameId")
        if (gameId != null) {
            val subscriptions = gamesMovesSubscriptionsDictionary.getOrElse(gameId, { ConcurrentHashMap() })
            subscriptions.remove(session)
            println("removed game subscription")
        }
        println("removed member")
    }

    fun getSubscribers(gameId: String): Collection<WebSocketSession> {
        return gamesMovesSubscriptionsDictionary.getOrPut(gameId, { ConcurrentHashMap() }).values
    }
}
