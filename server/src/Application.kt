package com.crissCrossServer

import com.google.gson.Gson
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.http.content.*
import io.ktor.sessions.*
import io.ktor.features.*
import io.ktor.websocket.*
import io.ktor.http.cio.websocket.*
import java.time.*
import io.ktor.gson.*
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.generateNonce
import kotlinx.coroutines.ObsoleteCoroutinesApi
import kotlinx.coroutines.channels.consumeEach

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@KtorExperimentalAPI
@UseExperimental(ObsoleteCoroutinesApi::class)
@Suppress("unused") // Referenced in application.conf
fun Application.module() {
    val gameServer = GameServer()

    install(Sessions) {
        cookie<GameSession>("SESSION") {
            cookie.extensions["SameSite"] = "lax"
        }
    }

    install(DefaultHeaders) {
        header("X-Engine", "Ktor") // will send this header with each response
    }

    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(15)
        timeout = Duration.ofSeconds(15)
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }

    install(ContentNegotiation) {
        gson {
        }
    }
    intercept(ApplicationCallPipeline.Features) {
        if (call.sessions.get<GameSession>() == null) {
            call.sessions.set(GameSession(generateNonce()))
        }
    }

    routing {
        static {
            resource("/", "static/index.html")
            resource("/game/*", "static/index.html")
        }

        // Static feature. Try to access `/static/ktor_logo.svg`
        static("/static") {
            resources("static")
        }

        webSocket("/ws/game") {
            val gson = Gson()
            val session = call.sessions.get<GameSession>()!!
            val gameRouter = GameRouter(gameServer, session, this)
            val user = gameServer.getUser(session)

            if (user != null) {
                send(Frame.Text("user|${gson.toJson(user)}"))
            } else {
                send(Frame.Text("user|"))
            }

            val gamesJson = gson.toJson(gameServer.getAllGames().toList())
            send(Frame.Text("games|$gamesJson"))

            send(Frame.Text("initialized|${session.id}"))
            try {
                incoming.consumeEach { frame ->
                    if (frame is Frame.Text) {
                        gameRouter.routeFrame(frame.readText())
                    }
                }
            } finally {
                gameServer.memberLeft(this)
            }
        }

        get("/json/gson") {
            call.respond(mapOf("hello" to "world"))
        }
    }
}
