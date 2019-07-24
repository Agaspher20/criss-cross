package com.crissCrossServer

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
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
            frameText.startsWith("games|") -> {
                val command = frameText.removePrefix("games|")
                when {
                    command.startsWith("create|") -> {
                        val gameName = command.removePrefix("create|")
                        val game = this.server.createGame(gameName)
                        this.wsSession.send(Frame.Text("games|${game.id}"))
                    }
                }
            }
            frameText.startsWith("game|") -> {
                val command = frameText.removePrefix("game|")
                when {
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
                    command.startsWith("move|") -> {
                        val moveText = command.removePrefix("move|")
                        val gson = Gson()

                        try {
                            val move = gson.fromJson<GameMove>(moveText, GameMove::class.java)
                            server.moveGame(move)
                        } catch (exc: JsonSyntaxException) {
                            // skip move
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
