import { Dispatch } from "redux";
import { savingGame, addGame } from "../actions";
import { submitGame } from "../../api/game-api-service";

export function createGame(dispatch: Dispatch): (name: string) => Promise<void> {
    return async (name: string) => {
        dispatch(savingGame(true));

        const id = await submitGame(name);

        dispatch(addGame({ id, name }));
        dispatch(savingGame(false));
    };
}
