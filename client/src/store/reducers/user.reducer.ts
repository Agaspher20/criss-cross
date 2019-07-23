import { Action } from "redux";
import { StoreActions, StoreActionsValue, SetUserNameAction } from "../actions";
import { UserModel } from "../../model/user.model";

const defaultUserModel: UserModel = {
    name: "",
    savingName: true
};

export function user(state: UserModel = defaultUserModel, action: Action<StoreActions>): UserModel {
    switch (action.type) {
        case StoreActionsValue.SetUserName:
            return setUserName(state, action as SetUserNameAction);
        case StoreActionsValue.SavingUserName:
            return savingUserName(state);
        default:
            return state;
    }
}

function setUserName(state: UserModel, action: SetUserNameAction): UserModel {
    return {
        ...state,
        name: action.name && action.name.trim() ? action.name : state.name,
        savingName: false
    };
}

function savingUserName(state: UserModel): UserModel {
    return {
        ...state,
        savingName: true
    };
}
