import { Dispatch } from "redux";
import { savingGame, addGame } from "../actions";
import { submitGame } from "../../api/game-api-service";

export function submitGameThunk(dispatch: Dispatch): (name: string) => Promise<void> {
    return (name: string) => {
        dispatch(savingGame(true));

        return submitGame(name).then(id => {
            dispatch(addGame({ id, name }));
            dispatch(savingGame(false));
        });
    };
}
