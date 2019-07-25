package com.crissCrossServer

import java.util.concurrent.ConcurrentHashMap

data class Game(val id: Int, val name: String)

data class GameDetails(
    var nextSymbol: String,
    val moves: List<StoredGameMove>,
    var lastMoveId: String? = null,
    var winnerSymbol: String? = null)

data class StoredGameDetails(
    var nextSymbol: String,
    val moves: ConcurrentHashMap<Int, StoredGameMove>,
    var lastMoveId: String? = null,
    var winnerSymbol: String? = null)

data class GameMove(
    val gameId: Int,
    val userId: String,
    val cellIndex: Int,
    val symbol: String
)

data class StoredGameMove(
    val userId: String,
    val cellIndex: Int,
    val symbol: String
)

data class User(val id: String, val name: String?)
