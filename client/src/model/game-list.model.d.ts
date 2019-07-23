export interface GameListModel {
    games: ReadonlyArray<GameModel>;
    savingGame: boolean;
    loadingGames: boolean;
}
