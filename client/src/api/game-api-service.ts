import { requestResponse, listenFirst, sendData, listenChannel, ChannelCallback, stopListenChannel } from "./game.api";
import { GameItem, GameDtoModel, GameMove, GameParameters } from "../model/game.model";
import { UserModel } from "../model/user.model";

enum Channels {
    User = "user",
    Game = "game",
    Games = "games",
    Init = "init"
}

type GameMoveCallback = (move: GameMove) => void;
type GameUpdatedCallback = (game: GameItem) => void;

const gameListeners: {
    [key: string]: ChannelCallback | undefined
} = {};

function createGameMoveListener (
    gameId: string,
    callback: GameMoveCallback
): ChannelCallback {
    return data => {
        const parsedMove: GameMove = JSON.parse(data);
        if (parsedMove.gameId === gameId) {
            callback(parsedMove);
        }
    };
}

function stopGameListener(gameId: string) {
    const listener = gameListeners[gameId];
    if (listener) {
        stopListenChannel(Channels.Game, listener);
        gameListeners[gameId] = undefined;
    }
}

function setGameListener(gameId: string, listener: ChannelCallback): void {
    stopGameListener(gameId);
    gameListeners[gameId] = listener;
}

export function subscribeGameMoves(gameId: string, callback: GameMoveCallback): void {
    const listener = createGameMoveListener(gameId, callback);
    setGameListener(gameId, listener);
    listenChannel(`${Channels.Game}|move`, listener);
}

export function subscribeGameListUpdates(callback: GameUpdatedCallback): void {
    listenChannel(`${Channels.Games}|updated`, data => {
        const parsedGame: GameItem = JSON.parse(data);
        callback(parsedGame);
    });
}

export function unsubscribeGame(gameId: string): void {
    stopGameListener(gameId);
    sendData(`${Channels.Game}|unsubscribe`, gameId.toString());
}

export function submitUserName(name: string): Promise<string> {
    return requestResponse(Channels.User, name);
}

export async function fetchUser(): Promise<UserModel> {
    const userString = await listenFirst(Channels.User);
    return JSON.parse(userString);
}

export async function fetchParameters(): Promise<GameParameters> {
    const paramsString = await listenFirst(Channels.Init);
    return JSON.parse(paramsString);
}

export async function submitGame(name: string): Promise<string> {
    const gameIdString = await requestResponse(`${Channels.Games}|create`, name);
    return gameIdString;
}

export async function fetchGames(): Promise<ReadonlyArray<GameItem>> {
    const gamesString = await listenFirst(`${Channels.Games}|list`);
    return JSON.parse(gamesString);
}

export async function fetchGame(id: string): Promise<GameDtoModel> {
    const gameString = await requestResponse(`${Channels.Game}|load`, id);

    if (!gameString) {
        throw new GameNotFoundError();
    }
    return JSON.parse(gameString);
}

export function submitMove(move: GameMove): Promise<void> {
    return sendData(`${Channels.Game}|move`, JSON.stringify(move));
}

export class GameNotFoundError extends Error {}
