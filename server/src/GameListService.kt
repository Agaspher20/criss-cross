package com.crissCrossServer

import io.ktor.http.cio.websocket.WebSocketSession
import io.ktor.util.KtorExperimentalAPI
import java.util.*
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.collections.HashMap
import kotlin.concurrent.read
import kotlin.concurrent.write

class GameListService(private val storage: GameStorage) {
    private val gamesListLock = ReentrantReadWriteLock(false)

    fun getAllGames(): List<GameItem> {
        val allGames =  gamesListLock.read { this.storage.getGames().toList() }
        return allGames.map { game -> this.storage.getGameLock(game).read {
            mapToGameItem(game, this.storage.getGameDetails(game))
        } }
    }

    @KtorExperimentalAPI
    fun createGame(name: String): GameItem = gamesListLock.write {
        val game = this.storage.createGame(name)

        return this.storage.getGameLock(game).read {
            mapToGameItem(game, this.storage.getGameDetails(game))
        }
    }

    fun enterGame(gameId: String, userId: String, session: WebSocketSession): GameItem? {
        this.storage.saveGameSubscription(gameId, session)

        return updateGame(gameId, GameUpdate(userId, 1))
    }

    fun leaveGame(gameId: String, userId: String, session: WebSocketSession): GameItem? {
        this.storage.removeGameSubscriptionById(gameId, session)

        return updateGame(gameId, GameUpdate(userId, -1))
    }

    fun memberLeft(userId: String, session: WebSocketSession): GameItem? {
        val gameId = this.storage.removeGameSubscriptionBySession(session)

        return if (gameId == null ) null else updateGame(gameId, GameUpdate(userId, -1))
    }

    fun onGameMove(gameId: String): GameItem? = updateGame(gameId, GameUpdate(null, 0, Date().time))

    private fun updateGame(gameId: String, update: GameUpdate): GameItem? {
        val game = this.storage.getGame(gameId)

        if (game == null) {
            return null
        }

        val writtenDetails = this.storage.getGameLock(game).write {
            val details = this.storage.getGameDetails(game)
            val updatedDetails = when {
                (update.userId != null && update.delta != 0) -> {
                    details.copy(
                        participants = updateGameParticipants(details.participants, update.userId, update.delta)
                    )
                }
                (update.updateTime != null) -> {
                    details.copy(lastUpdate = update.updateTime)
                }
                else -> details
            }
            this.storage.putGameDetails(game, updatedDetails)
            updatedDetails
        }

        return mapToGameItem(game, writtenDetails)
    }

    private fun updateGameParticipants(
        participants: Map<String, Int>,
        userId: String,
        delta: Int): Map<String, Int> {
        val count = participants.getOrDefault(userId, 0) + delta
        val nextParticipants = HashMap(participants)
        if (count == 0) {
            nextParticipants.remove(userId)
        } else {
            nextParticipants[userId] = count
        }

        return nextParticipants
    }

    private fun mapToGameItem(game: Game, details: StoredGameDetails): GameItem = GameItem(
        game.id,
        game.name,
        details.participants.values.size,
        game.creationTime,
        details.lastUpdate)
}
