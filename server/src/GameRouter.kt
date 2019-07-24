package com.crissCrossServer

import com.google.gson.Gson
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.WebSocketSession

class GameRouter(
        private val server: GameServer,
        private val gameSession: GameSession,
        private val wsSession: WebSocketSession) {
    public suspend fun routeFrame(frameText: String): Unit {
        when {
            frameText.startsWith("user|") -> {
                val userName = frameText.removePrefix("user|")
                this.server.setUserName(this.gameSession, userName)
                this.wsSession.send(Frame.Text("user|$userName"))
            }
            frameText.startsWith("game|") -> {
                val command = frameText.removePrefix("game|")
                when {
                    command.startsWith("create|") -> {
                        val gameName = command.removePrefix("create|")
                        val game = this.server.createGame(gameName)
                        this.wsSession.send(Frame.Text("game|${game.id}"))
                    }
                    command.startsWith("load|") -> {
                        val idString = command.removePrefix("load|")

                        try {
                            val id = idString.toInt()
                            val game = this.server.getGameDetails(id)

                            val gameText = if (game == null ) {
                                ""
                            } else {
                                val gson = Gson()
                                gson.toJson(game)
                            }
                            this.wsSession.send(Frame.Text("game|$gameText"))
                        } catch (exc: NumberFormatException) {
                            this.wsSession.send(Frame.Text("game|"))
                        }
                    }
                }
            }
            else -> {
                wsSession.send(Frame.Text("Unknown action \"$frameText\""))
            }
        }
    }
}
