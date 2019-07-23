import { combineReducers, Reducer, Action, createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { StoreActions, setUserName, setGames } from "./actions";
import { games } from "./reducers/game-list.reducer";
import { currentGame } from "./reducers/current-game.reducer";
import { user } from "./reducers/user.reducer";
import { UserModel } from "../model/user.model";
import { fetchUserName, fetchGames } from "../api/game-api-service";
import { connectToServer } from "../api/game.api";
import { GameModel } from "../model/game.model";
import { GameListModel } from "../model/game-list.model";

export interface CrissCrossState {
    readonly currentGame: GameModel;
    readonly games: GameListModel;
    readonly user: UserModel;
}

const storeReducer: Reducer<CrissCrossState, Action<StoreActions>> = combineReducers({
    games,
    user,
    currentGame,
});

export const crissCrossStore = createStore(storeReducer, applyMiddleware(thunkMiddleware));

fetchUserName().then(userName => crissCrossStore.dispatch(setUserName(userName)));
fetchGames().then(games => crissCrossStore.dispatch(setGames(games)));
connectToServer();
