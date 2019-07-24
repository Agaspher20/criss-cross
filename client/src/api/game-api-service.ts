import { requestResponse, listenFirst, sendData, listenChannel } from "./game.api";
import { GameItem, GameDtoModel, GameMove } from "../model/game.model";
import { UserModel } from "../model/user.model";

enum Channels {
    User = "user",
    Game = "game",
    Games = "games",
}

export function submitUserName(name: string): Promise<string> {
    return requestResponse(Channels.User, name);
}

export async function fetchUser(): Promise<UserModel> {
    const userString = await listenFirst(Channels.User);
    return JSON.parse(userString);
}

export async function submitGame(name: string): Promise<number> {
    const id = await requestResponse(Channels.Games, `create|${name}`);
    return parseInt(id, 10);
}

export async function fetchGames(): Promise<ReadonlyArray<GameItem>> {
    const gamesString = await listenFirst(Channels.Games);
    return JSON.parse(gamesString);
}

export async function fetchGame(id: number): Promise<GameDtoModel> {
    const gameString = await requestResponse(Channels.Game, `load|${id.toString()}`);

    if (!gameString) {
        throw new GameNotFoundError();
    }
    return JSON.parse(gameString);
}

export function submitMove(move: GameMove): Promise<void> {
    return sendData(Channels.Game, `move|${JSON.stringify(move)}`);
}

export class GameNotFoundError extends Error {}
