import { Dispatch } from "redux";
import { loadingGame, setGame, setGameNotFound, moveGame, ensureGameName } from "../actions";
import { fetchGame, GameNotFoundError, subscribeGame, unsubscribeGame } from "../../api/game-api-service";

export function loadGame(
    dispatch: Dispatch
): (id: number, name?: string) => Promise<void> {
    return async (id: number, name?: string) => {
        dispatch(loadingGame(id, name));
        try {
            subscribeGame(id, move => {
                dispatch(moveGame(move));
            });

            const gameDto = await fetchGame(id);
            dispatch(setGame(gameDto));
            dispatch(ensureGameName());
        } catch (error) {
            unsubscribeGame(id);
            if (error instanceof GameNotFoundError) {
                dispatch(setGameNotFound());
            } else {
                throw error;
            }
        }
    };
}
