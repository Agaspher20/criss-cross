import { GameItem } from "./game.model";

export interface GameListModel {
    readonly games: ReadonlyArray<GameItem>;
    readonly idsSet: Set<string>;
    readonly savingGame: boolean;
    readonly loadingGames: boolean;
}
