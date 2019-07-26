import { GameItem } from "./game.model";

export interface GameListModel {
    games: ReadonlyArray<GameItem>;
    idsSet: Set<number>;
    savingGame: boolean;
    loadingGames: boolean;
}
