import { Dispatch } from "redux";
import { loadingGame, setGame, setGameNotFound } from "../actions";
import { fetchGame, GameNotFoundError } from "../../api/game-api-service";

export function loadGame(
    dispatch: Dispatch
): (id: number, name?: string) => Promise<void> {
    return async (id: number, name?: string) => {
        dispatch(loadingGame(id, name));
        try {
            const gameDto = await fetchGame(id);
            dispatch(setGame(gameDto));
        } catch (error) {
            if (error instanceof GameNotFoundError) {
                dispatch(setGameNotFound());
            } else {
                throw error;
            }
        }
    };
}
