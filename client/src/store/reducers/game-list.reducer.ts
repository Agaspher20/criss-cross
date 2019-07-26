import { Action } from "redux";
import { StoreActions, UpdateGameListAction, SetGamesAction } from "../actions";
import { GameListModel } from "../../model/game-list.model";
import { GameItem } from "../../model/game.model";

export const defaultGameList: GameListModel = {
    games: [],
    idsSet: new Set(),
    loadingGames: true,
    savingGame: false,
}

export function games(
    state: GameListModel = defaultGameList,
    action: Action<StoreActions>
): GameListModel {
    switch (action.type) {
        case StoreActions.UpdateGameList:
            return updateGameList(state, action as UpdateGameListAction);
        case StoreActions.SetGames:
            return setGames(state, action as SetGamesAction);
        default:
            return state;
    }
}

function updateGameList(
    state: GameListModel,
    { game }: UpdateGameListAction
): GameListModel {
    let games: ReadonlyArray<GameItem>;
    let idsSet: Set<string>;

    if (state.idsSet.has(game.id)) {
        games = state.games.map(gm => gm.id === game.id ? game : gm);
        idsSet = state.idsSet;
    } else {
        games = [game, ...state.games];
        idsSet = new Set(games.map(game => game.id));
    }

    return {
        ...state,
        games,
        idsSet
    };
}

function setGames(
    state: GameListModel,
    { games }: SetGamesAction
): GameListModel {
    return {
        ...state,
        loadingGames: false,
        games,
        idsSet: createIdsSet(games)
    };
}

function createIdsSet(games: ReadonlyArray<GameItem>): Set<string> {
    return new Set(games.map(g => g.id));
}
