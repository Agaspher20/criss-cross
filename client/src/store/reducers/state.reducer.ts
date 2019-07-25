import { Action, Reducer, combineReducers } from "redux";
import { StoreActions } from "../actions";
import { CrissCrossState } from "../criss-cross.store";
import { defaultGame } from "./current-game.reducer";
import { defaultUserModel } from "./user.reducer";
import { defaultGameList } from "./game-list.reducer";
import { games } from "./game-list.reducer";
import { currentGame } from "./current-game.reducer";
import { user } from "./user.reducer";

const defaultState: CrissCrossState = {
    currentGame: defaultGame,
    games: defaultGameList,
    user: defaultUserModel
}

const reducers: Reducer<CrissCrossState, Action<StoreActions>> = combineReducers({
    games,
    user,
    currentGame,
});

export const stateReducer: Reducer<CrissCrossState, Action<StoreActions>> = state;

function state(
    state: CrissCrossState = defaultState,
    action: Action<StoreActions>
): CrissCrossState {
    switch (action.type) {
        case StoreActions.EnsureGameName:
            return ensureGameName(state);
        default:
            return reducers(state, action);
    }
}

function ensureGameName(state: CrissCrossState): CrissCrossState {
    const currentGame = state.currentGame;
    const games = state.games.games;

    if (games.length && !currentGame.name && currentGame.id > -1) {
        const gameItem = games.find(game => game.id === currentGame.id);
        if (gameItem) {
            const ensuredGame = {
                ...currentGame,
                name: gameItem.name,
            };

            return {
                ...state,
                currentGame: ensuredGame
            };
        }
    }

    return state;
}
