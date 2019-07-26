import { GameItem } from "./game.model";

export interface GameListModel {
    games: ReadonlyArray<GameItem>;
    idsSet: Set<string>;
    savingGame: boolean;
    loadingGames: boolean;
}
