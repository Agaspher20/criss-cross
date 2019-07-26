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

const gameListeners: {
    [key: number]: ChannelCallback | undefined
} = {};

function createGameListener (
    gameId: number,
    callback: GameMoveCallback
): ChannelCallback {
    return data => {
        const parsedMove: GameMove = JSON.parse(data);
        if (parsedMove.gameId === gameId) {
            callback(parsedMove);
        }
    };
}

function stopGameListener(gameId: number) {
    const listener = gameListeners[gameId];
    if (listener) {
        stopListenChannel(Channels.Game, listener);
        gameListeners[gameId] = undefined;
    }
}

function setGameListener(gameId: number, listener: ChannelCallback): void {
    stopGameListener(gameId);
    gameListeners[gameId] = listener;
}

export function subscribeGame(gameId: number, callback: GameMoveCallback): void {
    const listener = createGameListener(gameId, callback);
    setGameListener(gameId, listener);
    listenChannel(`${Channels.Game}|move`, listener);
    sendData(`${Channels.Game}|subscribe`, gameId.toString());
}

export function unsubscribeGame(gameId: number): void {
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

export async function submitGame(name: string): Promise<number> {
    const id = await requestResponse(`${Channels.Games}|create`, name);
    return parseInt(id, 10);
}

export async function fetchGames(): Promise<ReadonlyArray<GameItem>> {
    const gamesString = await listenFirst(Channels.Games);
    return JSON.parse(gamesString);
}

export async function fetchGame(id: number): Promise<GameDtoModel> {
    const gameString = await requestResponse(`${Channels.Game}|load`, id.toString());

    if (!gameString) {
        throw new GameNotFoundError();
    }
    return JSON.parse(gameString);
}

export function submitMove(move: GameMove): Promise<void> {
    return sendData(`${Channels.Game}|move`, JSON.stringify(move));
}

export class GameNotFoundError extends Error {}
