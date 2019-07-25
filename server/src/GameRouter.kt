package com.crissCrossServer

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.WebSocketSession

class GameRouter(
        private val server: GameServer,
        private val gameSession: GameSession,
        private val wsSession: WebSocketSession) {
    public suspend fun routeFrame(frameText: String) {
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
                            val move = gson.fromJson(moveText, GameMove::class.java)
                            val submittedMove = server.moveGame(move)

                            if (submittedMove != null) {
                                val subscribers = server.getSubscribers(move.gameId)
                                subscribers.forEach { session ->
                                    session.send(Frame.Text("game|move|$moveText"))
                                }
                            }
                        } catch (exc: JsonSyntaxException) {
                            // skip move
                        }
                    }
                    command.startsWith("subscribe|") -> {
                        val gameIdString = command.removePrefix("subscribe|")
                        try {
                            val gameId = gameIdString.toInt()
                            server.subscribeGame(gameId, this.wsSession)
                        } catch (exc: NumberFormatException) {
                            // do not add subscription
                        }
                    }
                    command.startsWith("unsubscribe|") -> {
                        val gameIdString = command.removePrefix("unsubscribe|")
                        try {
                            val gameId = gameIdString.toInt()
                            server.unsubscribeGame(gameId, this.wsSession)
                        } catch (exc: NumberFormatException) {
                            // do not add subscription
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
