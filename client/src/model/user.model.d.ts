export interface UserModel {
    readonly id: string;
    readonly name: string;
}

export interface UserStateModel extends UserModel {
    readonly savingName: boolean;
    readonly errorMessage?: string;
}
