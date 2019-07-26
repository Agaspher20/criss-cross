import { Dispatch } from "redux";
import { loadingGame, setGame, setGameNotFound, moveGame, ensureGameName } from "../actions";
import { fetchGame, GameNotFoundError, subscribeGameMoves, unsubscribeGame } from "../../api/game-api-service";

export function loadGame(
    dispatch: Dispatch
): (id: string, name?: string) => Promise<void> {
    return async (id: string, name?: string) => {
        dispatch(loadingGame(id, name));
        try {
            subscribeGameMoves(id, move => {
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
