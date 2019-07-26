package com.crissCrossServer

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.WebSocketSession

class GameController(
    private val gameParameters: GameParameters,
    private val gameStorage: GameStorage,
    private val gameService: GameService,
    private val userSession: UserSession,
    private val wsSession: WebSocketSession
) {
    private val gson = Gson()

    suspend fun initializeSession() {
        val user = this.gameStorage.getUser(this.userSession.id)

        this.sendToChannel("user", gson.toJson(user))

        val gamesJson = gson.toJson(gameStorage.getAllGames().toList())
        this.sendToChannel("init", this.gson.toJson(this.gameParameters))
        this.sendToChannel("games", gamesJson)
    }

    fun disposeSession() {
        this.gameStorage.memberLeft(this.wsSession)
    }

    suspend fun setUserName(userName: String) {
        this.gameStorage.setUserName(userSession.id, userName)
        this.sendToChannel("user", userName)
    }

    suspend fun createGame(gameName: String) {
        val game = this.gameStorage.createGame(gameName)
        this.sendToChannel("games|create", game.id.toString())
    }

    suspend fun loadGame(idString: String) {
        try {
            val id = idString.toInt()
            val storedGame = this.gameStorage.getGameDetails(id)

            val gameText = if (storedGame == null ) {
                ""
            } else {
                val game: GameDetails
                storedGame.lock.readLock().lock()
                try {
                    game = GameDetails(
                        storedGame.nextSymbol,
                        storedGame.moves.values.toList(),
                        storedGame.lastMoveId,
                        storedGame.winnerSymbol,
                        storedGame.winnerName)
                } finally {
                    storedGame.lock.readLock().unlock()
                }
                this.gson.toJson(game)
            }
            this.sendToChannel("game|load", gameText)
        } catch (exc: NumberFormatException) {
            this.sendToChannel("game|load")
        }
    }

    suspend fun gameMove(moveText: String) {
        try {
            val move = this.gson.fromJson(moveText, GameMove::class.java)
            val (submittedMove, winnerName) = gameService.moveGame(move)
            if (submittedMove != null) {
                val subscribers = gameStorage.getSubscribers(move.gameId)
                val approvedMove = move.copy(winnerName = winnerName)
                subscribers.forEach { session ->
                    session.send(Frame.Text("game|move|${this.gson.toJson(approvedMove)}"))
                }
            }
        } catch (exc: JsonSyntaxException) {
            println("Game move parsing failed")
        }
    }

    fun subscribeToGame(gameIdString: String) {
        try {
            val gameId = gameIdString.toInt()
            gameStorage.subscribeGame(gameId, this.wsSession)
        } catch (exc: NumberFormatException) {
            println("Game id parsing failed on subscribe")
        }
    }

    fun unsubscribeFromGame(gameIdString: String) {
        try {
            val gameId = gameIdString.toInt()
            gameStorage.unsubscribeGame(gameId, this.wsSession)
        } catch (exc: NumberFormatException) {
            println("Game id parsing failed on unsubscribe")
        }
    }

    private suspend fun sendToChannel(channelName: String, payload: String = "") {
        this.wsSession.send(Frame.Text("$channelName|$payload"))
    }
}