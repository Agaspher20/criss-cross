import { requestResponse, listenFirst } from "./game.api";
import { GameItem, GameDtoModel } from "../model/game.model";

enum Channels {
    User = "user",
    Game = "game",
    Games = "games",
}

export function submitUserName(name: string): Promise<string> {
    return requestResponse(Channels.User, name);
}

export function fetchUserName(): Promise<string> {
    return listenFirst(Channels.User);
}

export async function submitGame(name: string): Promise<number> {
    const id = await requestResponse(Channels.Game, `create|${name}`);
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

export class GameNotFoundError extends Error {}
