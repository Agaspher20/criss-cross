package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.generateNonce
import java.util.concurrent.locks.ReentrantReadWriteLock

class GameListService(private val storage: GameStorage) {
    private val gameListLock = ReentrantReadWriteLock(false)

    fun getAllGames(): List<GameItem> {
        gameListLock.readLock().lock()

        return (try {
            this.storage.getGames()
                .toList()
                .map { game -> mapToGameItem(game) }
        } finally {
            gameListLock.readLock().unlock()
        })
    }

    @KtorExperimentalAPI
    fun createGame(name: String): GameItem {
        gameListLock.writeLock().lock()
        try {
            val game = Game(generateNonce(), name, HashMap())
            this.storage.putGame(game)

            return mapToGameItem(game)
        } finally {
            gameListLock.writeLock().unlock()
        }
    }

    fun enterGame(gameId: String, userId: String, session: WebSocketSession): GameItem {
        this.storage.saveGameSubscription(gameId, session)

        return updateGame(gameId, GameUpdate(userId, 1))
    }

    fun leaveGame(gameId: String, userId: String, session: WebSocketSession): GameItem {
        this.storage.removeGameSubscriptionById(gameId, session)

        return updateGame(gameId, GameUpdate(userId, -1))
    }

    fun memberLeft(userId: String, session: WebSocketSession): GameItem? {
        val gameId = this.storage.removeGameSubscriptionBySession(session)

        return if (gameId == null ) null else updateGame(gameId, GameUpdate(userId, -1))
    }

    private fun updateGame(gameId: String, update: GameUpdate): GameItem {
        val game = this.getGame(gameId)

        this.gameListLock.writeLock().lock()
        return try {
            if (update.userId != null && update.delta != 0) {
                val count = game.participants.getOrDefault(update.userId, 0) + update.delta
                if (count == 0) {
                    game.participants.remove(update.userId)
                } else {
                    game.participants[update.userId] = count
                }
                mapToGameItem(game)
            } else {
                mapToGameItem(game)
            }
        } finally {
            this.gameListLock.writeLock().unlock()
        }
    }

    private fun getGame(gameId: String): Game {
        this.gameListLock.readLock().lock()
        return try {
            this.storage.getGame(gameId)
        } finally {
            this.gameListLock.readLock().unlock()
        }
    }

    private fun mapToGameItem(game: Game) = GameItem(game.id, game.name, game.participants.values.toList().sum())
}
