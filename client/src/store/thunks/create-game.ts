import { Dispatch } from "redux";
import { savingGame, addGame } from "../actions";
import { submitGame } from "../../api/game-api-service";

export function createGame(dispatch: Dispatch): (name: string) => Promise<void> {
    return async (name: string) => {
        dispatch(savingGame(true));

        const savedGame = await submitGame(name);

        dispatch(addGame(savedGame));
        dispatch(savingGame(false));
    };
}
