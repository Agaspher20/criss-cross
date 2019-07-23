import { requestResponse, listenFirst } from "./game.api";
import { GameItem } from "../model/game.model";

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

export function submitGame(name: string): Promise<number> {
    return requestResponse(Channels.Game, `create|${name}`).then(id => parseInt(id, 10));
}

export function fetchGames(): Promise<ReadonlyArray<GameItem>> {
    return listenFirst(Channels.Games).then(gamesString => JSON.parse(gamesString));
}
