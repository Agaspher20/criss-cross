import { Dispatch } from "redux";
import { setDefaultGame } from "../actions";
import { unsubscribeGame } from "../../api/game-api-service";

export function unloadGame(
    dispatch: Dispatch
): (id: string) => Promise<void> {
    return async (id: string) => {
        dispatch(setDefaultGame());
        unsubscribeGame(id);
    };
}
