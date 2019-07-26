package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.generateNonce
import java.util.concurrent.locks.ReentrantReadWriteLock

class GameListService(private val storage: GameStorage) {
    private val gameListLock = ReentrantReadWriteLock(false)

    fun getAllGames(): List<Game> {
        gameListLock.readLock().lock()

        return try {
            this.storage.getGames().toList()
        } finally {
            gameListLock.readLock().unlock()
        }
    }

    @KtorExperimentalAPI
    fun createGame(name: String): Game {
        gameListLock.writeLock().lock()

        try {
            val game = Game(generateNonce(), name, 0)
            this.storage.putGame(game)

            return game
        } finally {
            gameListLock.writeLock().unlock()
        }
    }

    fun enterGame(gameId: String, session: WebSocketSession): Game {
        this.storage.saveGameSubscription(gameId, session)

        return this.getGame(gameId)
    }

    fun leaveGame(gameId: String, session: WebSocketSession): Game {
        this.storage.removeGameSubscriptionById(gameId, session)

        return this.getGame(gameId)
    }

    fun memberLeft(session: WebSocketSession): Game? {
        val gameId = this.storage.removeGameSubscriptionBySession(session)

        return if (gameId == null ) null else this.getGame(gameId)
    }

    private fun getGame(gameId: String): Game {
        this.gameListLock.readLock().lock()
        return try {
            this.storage.getGame(gameId)
        } finally {
            this.gameListLock.readLock().unlock()
        }
    }
}