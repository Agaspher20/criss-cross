package com.crissCrossServer

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantReadWriteLock

data class GameItem(
    val id: String,
    val name: String,
    val participantsCount: Int,
    val creationTime: Long,
    val lastUpdate: Long? = null)

data class Game(
    val id: String,
    val name: String,
    val participants: MutableMap<String, Int>,
    val creationTime: Long,
    val lastUpdate: Long? = null)

data class GameUpdate(val userId: String?, val delta: Int, val updateTime: Long? = null)

data class GameParameters(val symbolsToWin: Int, val sideSize: Int)

data class GameDetails(
    val nextSymbol: String,
    val moves: List<StoredGameMove>,
    val lastMoveId: String? = null,
    val winnerSymbol: String? = null,
    val winnerName: String? = null)

data class StoredGameDetails(
    val nextSymbol: String,
    val moves: ConcurrentHashMap<Int, StoredGameMove>,
    val lock: ReentrantReadWriteLock,
    val lastMoveId: String? = null,
    val winnerSymbol: String? = null,
    val winnerName: String? = null)

data class GameMove(
    val gameId: String,
    val userId: String,
    val cellIndex: Int,
    val symbol: String,
    val winnerName: String?
)

data class StoredGameMove(
    val userId: String,
    val cellIndex: Int,
    val symbol: String
)

data class Position (val rowIndex: Int, val columnIndex: Int)

data class User(val id: String, val name: String?)
