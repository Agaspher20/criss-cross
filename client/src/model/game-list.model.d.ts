import { GameItem } from "./game.model";

export interface GameListModel {
    games: ReadonlyArray<GameItem>;
    savingGame: boolean;
    loadingGames: boolean;
}
