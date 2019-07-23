import { Action } from "redux";
import { StoreActions, StoreActionsValue, AddGameAction, SetGamesAction } from "../actions";
import { GameListModel } from "../../model/game-list.model";

const defaultGameList: GameListModel = {
    games: [],
    loadingGames: true,
    savingGame: false,
}

export function games(
    state: GameListModel = defaultGameList,
    action: Action<StoreActions>
): GameListModel {
    switch (action.type) {
        case StoreActionsValue.AddGame:
            return addGame(state, action as AddGameAction);
        case StoreActionsValue.SetGames:
            return setGames(state, action as SetGamesAction);
        default:
            return state;
    }
}

function addGame(
    state: GameListModel,
    { game }: AddGameAction
): GameListModel {
    return {
        ...state,
        games: [game, ...state.games]
    };
}

function setGames(
    state: GameListModel,
    { games }: SetGamesAction
): GameListModel {
    return {
        ...state,
        loadingGames: false,
        games
    };
}
