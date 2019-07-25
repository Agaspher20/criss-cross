package com.crissCrossServer

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.WebSocketSession

class GameController(
    private val gameServer: GameServer,
    private val userSession: UserSession,
    private val wsSession: WebSocketSession
) {
    private val gson = Gson()

    suspend fun initializeSession() {
        val user = this.gameServer.getUser(this.userSession.id)

        this.sendToChannel("user", gson.toJson(user))

        val gamesJson = gson.toJson(gameServer.getAllGames().toList())
        this.sendToChannel("games", gamesJson)
        this.sendToChannel("initialized", this.userSession.id)
    }

    suspend fun setUserName(userName: String) {
        this.gameServer.setUserName(userSession.id, userName)
        this.sendToChannel("user", userName)
    }

    suspend fun createGame(gameName: String) {
        val game = this.gameServer.createGame(gameName)
        this.sendToChannel("games", game.id.toString())
    }

    suspend fun loadGame(idString: String) {
        try {
            val id = idString.toInt()
            val game = this.gameServer.getGameDetails(id)

            val gameText = if (game == null ) {
                ""
            } else {
                this.gson.toJson(game)
            }
            this.sendToChannel("game", gameText)
        } catch (exc: NumberFormatException) {
            this.sendToChannel("game")
        }
    }

    suspend fun gameMove(moveText: String) {
        try {
            val move = this.gson.fromJson(moveText, GameMove::class.java)
            val submittedMove = gameServer.moveGame(move)

            if (submittedMove != null) {
                val subscribers = gameServer.getSubscribers(move.gameId)
                subscribers.forEach { session ->
                    session.send(Frame.Text("game|move|$moveText"))
                }
            }
        } catch (exc: JsonSyntaxException) {
            println("Game move parsing failed")
        }
    }

    fun subscribeToGame(gameIdString: String) {
        try {
            val gameId = gameIdString.toInt()
            gameServer.subscribeGame(gameId, this.wsSession)
        } catch (exc: NumberFormatException) {
            println("Game id parsing failed on subscribe")
        }
    }

    fun unsubscribeFromGame(gameIdString: String) {
        try {
            val gameId = gameIdString.toInt()
            gameServer.unsubscribeGame(gameId, this.wsSession)
        } catch (exc: NumberFormatException) {
            println("Game id parsing failed on unsubscribe")
        }
    }

    private suspend fun sendToChannel(channelName: String, payload: String = "") {
        this.wsSession.send(Frame.Text("$channelName|$payload"))
    }
}