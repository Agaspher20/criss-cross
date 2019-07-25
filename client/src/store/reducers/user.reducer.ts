import { Action } from "redux";
import { StoreActions, SetUserNameAction, SetUserAction } from "../actions";
import { UserStateModel } from "../../model/user.model";

export const defaultUserModel: UserStateModel = {
    id: "",
    name: "",
    savingName: true
};

export function user(state: UserStateModel = defaultUserModel, action: Action<StoreActions>): UserStateModel {
    switch (action.type) {
        case StoreActions.SetUser:
            return setUser(state, action as SetUserAction);
        case StoreActions.SetUserName:
            return setUserName(state, action as SetUserNameAction);
        case StoreActions.SavingUserName:
            return savingUserName(state);
        default:
            return state;
    }
}

function setUser(state: UserStateModel, { user }: SetUserAction): UserStateModel {
    return {
        ...state,
        id: user.id,
        name: user.name && user.name.trim() ? user.name : state.name,
        savingName: false
    };
}

function setUserName(state: UserStateModel, { name }: SetUserNameAction): UserStateModel {
    return {
        ...state,
        name,
        savingName: false
    };
}

function savingUserName(state: UserStateModel): UserStateModel {
    return {
        ...state,
        savingName: true
    };
}
