import { Dispatch } from "redux";
import { savingGame, updateGameList } from "../actions";
import { submitGame } from "../../api/game-api-service";

export function createGame(dispatch: Dispatch): (name: string) => Promise<void> {
    return async (name: string) => {
        dispatch(savingGame(true));

        const id = await submitGame(name);

        dispatch(updateGameList({ id, name, participantsCount: 0, lastUpdate: new Date().getTime() }))
        dispatch(savingGame(false));
    };
}
