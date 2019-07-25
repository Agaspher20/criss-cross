package com.crissCrossServer

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
    val gameStorage = GameStorage()

    install(Sessions) {
        cookie<UserSession>("SESSION") {
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
        if (call.sessions.get<UserSession>() == null) {
            call.sessions.set(UserSession(generateNonce()))
        }
    }

    routing {
        static {
            resource("/", "static/index.html")
            resource("/game/*", "static/index.html")
        }

        static("/static") {
            resources("static")
        }

        webSocket("/ws/game") {
            val session = call.sessions.get<UserSession>()!!
            val gameController = GameController(gameStorage, session, this)
            val gameRouter = GameRouter(gameController)

            gameController.initializeSession()
            try {
                incoming.consumeEach { frame ->
                    if (frame is Frame.Text) {
                        gameRouter.routeFrame(frame.readText())
                    }
                }
            } finally {
                gameController.disposeSession()
            }
        }

        get("/json/gson") {
            call.respond(mapOf("hello" to "world"))
        }
    }
}
