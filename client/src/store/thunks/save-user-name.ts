import { Dispatch } from "redux";
import { savingUserName, setUserName } from "../actions";
import { submitUserName } from "../../api/game-api-service";

export function saveUserName(dispatch: Dispatch): (userName: string) => Promise<void> {
    return async (userName: string) => {
        dispatch(savingUserName());

        const resultName = await submitUserName(userName)
        dispatch(setUserName(resultName));
    };
}
