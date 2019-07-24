import { combineReducers, Reducer, Action, createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { StoreActions, setUser, setGames } from "./actions";
import { games } from "./reducers/game-list.reducer";
import { currentGame } from "./reducers/current-game.reducer";
import { user } from "./reducers/user.reducer";
import { UserStateModel } from "../model/user.model";
import { fetchUser, fetchGames } from "../api/game-api-service";
import { connectToServer } from "../api/game.api";
import { GameModel } from "../model/game.model";
import { GameListModel } from "../model/game-list.model";

export interface CrissCrossState {
    readonly currentGame: GameModel;
    readonly games: GameListModel;
    readonly user: UserStateModel;
}

const storeReducer: Reducer<CrissCrossState, Action<StoreActions>> = combineReducers({
    games,
    user,
    currentGame,
});

export const crissCrossStore = createStore(storeReducer, applyMiddleware(thunkMiddleware));

fetchUser().then(userName => crissCrossStore.dispatch(setUser(userName)));
fetchGames().then(games => crissCrossStore.dispatch(setGames(games)));
connectToServer();
