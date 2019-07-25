import { Dispatch } from "redux";
import { setDefaultGame } from "../actions";
import { unsubscribeGame } from "../../api/game-api-service";

export function unloadGame(
    dispatch: Dispatch
): (id: number) => Promise<void> {
    return async (id: number) => {
        dispatch(setDefaultGame());
        unsubscribeGame(id);
    };
}
