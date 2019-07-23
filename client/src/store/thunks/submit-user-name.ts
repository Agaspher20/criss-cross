import { Dispatch } from "redux";
import { savingUserName, setUserName } from "../actions";
import { submitUserName } from "../../api/game-api-service";

export function submitUserNameThunk(dispatch: Dispatch) {
    return (userName: string) => {
        dispatch(savingUserName());

        return submitUserName(userName).then(resultName => dispatch(setUserName(resultName)));
    };
}
