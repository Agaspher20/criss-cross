package com.crissCrossServer

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.WebSocketSession
import io.ktor.util.KtorExperimentalAPI

class GameController(
    private val gameParameters: GameParameters,
    private val gameStorage: GameStorage,
    private val gameService: GameService,
    private val gameListService: GameListService,
    private val userSession: UserSession,
    private val wsSession: WebSocketSession
) {
    private val gson = Gson()

    suspend fun initializeSession() {
        this.gameStorage.registerUser(this.wsSession)
        val user = this.gameStorage.getUser(this.userSession.id)

        this.sendToChannel("user", gson.toJson(user))
        this.sendToChannel("init", this.gson.toJson(this.gameParameters))
        this.sendToChannel("games|list", gson.toJson(this.gameListService.getAllGames()))
    }

    suspend fun disposeSession() {
        this.gameStorage.unregisterUser(this.wsSession)
        this.broadcastGameUpdate(this.gameListService.memberLeft(this.userSession.id, this.wsSession))
    }

    suspend fun setUserName(userName: String) {
        this.gameStorage.setUserName(userSession.id, userName)
        this.sendToChannel("user", userName)
    }

    @KtorExperimentalAPI
    suspend fun createGame(gameName: String) {
        val game = this.gameListService.createGame(gameName)
        this.sendToChannel("games|create", game.id)
        this.broadcastGameUpdate(game)
    }

    suspend fun loadGame(id: String) {
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
        this.broadcastGameUpdate(this.gameListService.enterGame(id, this.userSession.id, this.wsSession))
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
                this.broadcastGameUpdate(this.gameListService.onGameMove(move.gameId))
            }
        } catch (exc: JsonSyntaxException) {
            println("Game move parsing failed")
        }
    }

    suspend fun leaveGame(gameId: String) = this.broadcastGameUpdate(
        this.gameListService.leaveGame(gameId, this.userSession.id, this.wsSession))

    private suspend fun sendToChannel(channelName: String, payload: String = "") {
        this.send(this.wsSession, channelName, payload)
    }

    private suspend fun broadcastGameUpdate(game: GameItem?) {
        if (game != null) {
            this.broadcast("games|updated", gson.toJson(game))
        }
    }

    private suspend fun broadcast(channelName: String, payload: String = "") {
        val participants = this.gameStorage.getAllWebSockets()
        println("Received participants ${participants.count()}")
        participants.forEach { socket ->
            println("Sent to channel \"$channelName\"")
            this.send(socket, channelName, payload)
        }
    }

    private suspend fun send(socket: WebSocketSession, channelName: String, payload: String = "") {
        socket.send(Frame.Text("$channelName|$payload"))
    }
}