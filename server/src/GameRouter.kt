package com.crissCrossServer

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
                }
            }
            else -> {
                wsSession.send(Frame.Text("Unknown action \"$frameText\""))
            }
        }
    }
}
