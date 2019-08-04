package com.crissCrossServer

import io.ktor.util.KtorExperimentalAPI
import org.slf4j.Logger
import java.lang.Exception
import kotlin.arrayOf

class FrameRoutingException(message: String) : Exception(message)

class FrameHandler(
    private val channelName: String,
    private val handler: suspend (frame: String, commandHandlers: Array<FrameHandler>?) -> Unit,
    private val commandHandlers: Array<FrameHandler>? = null
) {
    private val channelPrefix: String
        get () = "${this.channelName}|"

    fun canHandleFrame(frame: String): Boolean {
        return frame.startsWith(this.channelPrefix)
    }

    suspend fun handleFrame(frame: String) {
        this.handler(frame.removePrefix(this.channelPrefix), this.commandHandlers)
    }
}

class GameRouter(
        private val gameController: GameController,
        private val logger: Logger
) {

    @KtorExperimentalAPI
    private val handlers = arrayOf(
        FrameHandler(
            "user",
            { userName, _ -> this.gameController.setUserName(userName) }
        ),
        FrameHandler(
            "games",
            { command, handlers -> handleFrame(command, handlers) },
            arrayOf(
                FrameHandler("create", { gameName, _ -> this.gameController.createGame(gameName) })
            )
        ),
        FrameHandler(
            "game",
            { command, handlers -> handleFrame(command, handlers) },
            arrayOf(
                FrameHandler("load", { idString, _ -> this.gameController.loadGame(idString) }),
                FrameHandler("move", { moveText, _ -> this.gameController.gameMove(moveText) }),
                FrameHandler("unsubscribe", { gameIdString, _ -> this.gameController.leaveGame(gameIdString) })
            )
        )
    )

    @KtorExperimentalAPI
    suspend fun routeFrame(frameText: String) {
        try {
            handleFrame(frameText, this.handlers)
        } catch (exc: FrameRoutingException) {
            logger.error(exc.message)
        }
    }
}

suspend fun handleFrame(frameText: String, handlers: Array<FrameHandler>?) {
    val handler = handlers?.firstOrNull { handler -> handler.canHandleFrame(frameText) }

    if (handler != null) {
        handler.handleFrame(frameText)
    } else {
        throw FrameRoutingException("Unknown action \"$frameText\"")
    }
}
