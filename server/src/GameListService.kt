package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.generateNonce
import java.util.*
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.collections.HashMap
import kotlin.concurrent.read
import kotlin.concurrent.write

class GameListService(private val storage: GameStorage) {
    private val gameListLock = ReentrantReadWriteLock(false)

    fun getAllGames(): List<GameItem> = gameListLock.read {
        this.storage.getGames()
            .toList()
            .map { game -> mapToGameItem(game) }
    }

    @KtorExperimentalAPI
    fun createGame(name: String): GameItem = gameListLock.write {
        val game = Game(generateNonce(), name, HashMap(), Date().time)
        this.storage.putGame(game)

        return mapToGameItem(game)
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

    fun onGameMove(gameId: String): GameItem = updateGame(gameId, GameUpdate(null, 0, Date().time))

    private fun updateGame(gameId: String, update: GameUpdate): GameItem {
        val game = this.getGame(gameId)

        return this.gameListLock.write {
            when {
                (update.userId != null && update.delta != 0) -> {
                    updateGameParticipants(game, update.userId, update.delta)
                }
                (update.updateTime != null) -> {
                    game.lastUpdate = update.updateTime
                }
            }
            mapToGameItem(game)
        }
    }

    private fun updateGameParticipants(game: Game, userId: String, delta: Int) {
        val count = game.participants.getOrDefault(userId, 0) + delta
        if (count == 0) {
            game.participants.remove(userId)
        } else {
            game.participants[userId] = count
        }
    }

    private fun getGame(gameId: String): Game = this.gameListLock.read {
        this.storage.getGame(gameId)
    }

    private fun mapToGameItem(game: Game) = GameItem(
        game.id,
        game.name,
        game.participants.values.size,
        game.creationTime,
        game.lastUpdate)
}
