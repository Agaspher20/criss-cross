import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { setUser, setGames, ensureGameName, setGameParameters, updateGameList } from "./actions";
import { UserStateModel } from "../model/user.model";
import { fetchUser, fetchGames, fetchParameters, subscribeGameListUpdates } from "../api/game-api-service";
import { connectToServer } from "../api/game.api";
import { GameModel } from "../model/game.model";
import { GameListModel } from "../model/game-list.model";
import { stateReducer } from "./reducers/state.reducer";

export interface CrissCrossState {
    readonly currentGame: GameModel;
    readonly games: GameListModel;
    readonly user: UserStateModel;
}

export const crissCrossStore = createStore(stateReducer, applyMiddleware(thunkMiddleware));

fetchUser().then(userName => crissCrossStore.dispatch(setUser(userName)));
fetchParameters().then(parameters => crissCrossStore.dispatch(setGameParameters(parameters)))
fetchGames().then(games => {
    crissCrossStore.dispatch(setGames(games));
    crissCrossStore.dispatch(ensureGameName());
});
subscribeGameListUpdates(gameItem => crissCrossStore.dispatch(updateGameList(gameItem)))
connectToServer();
