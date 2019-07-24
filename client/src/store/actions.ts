import { Action } from "redux";
import { GameItem, GameDtoModel } from "../model/game.model";
import { UserModel } from "../model/user.model";

export type StoreActions =
    | "SET_USER"
    | "SET_USER_NAME"
    | "SAVING_USER_NAME"
    | "ADD_GAME"
    | "SAVING_GAME"
    | "SET_GAMES"
    | "LOADING_GAME"
    | "SET_GAME"
    | "SET_GAME_NOT_FOUND"
    | "MOVE_GAME";

interface StoreActionsValueInterface {
    readonly SetUser: StoreActions;
    readonly SetUserName: StoreActions;
    readonly SavingUserName: StoreActions;
    readonly AddGame: StoreActions;
    readonly SavingGame: StoreActions;
    readonly SetGames: StoreActions;
    readonly LoadingGame: StoreActions;
    readonly SetGame: StoreActions;
    readonly SetGameNotFound: StoreActions;
    readonly MoveGame: StoreActions;
}

export const StoreActionsValue: StoreActionsValueInterface = {
    SetUser: "SET_USER",
    SetUserName: "SET_USER_NAME",
    SavingUserName: "SAVING_USER_NAME",
    AddGame: "ADD_GAME",
    SavingGame: "SAVING_GAME",
    SetGames: "SET_GAMES",
    LoadingGame: "LOADING_GAME",
    SetGame: "SET_GAME",
    SetGameNotFound: "SET_GAME_NOT_FOUND",
    MoveGame: "MOVE_GAME",
};

export interface SetUserAction extends Action<StoreActions> {
    readonly user: UserModel;
}

export interface SetUserNameAction extends Action<StoreActions> {
    readonly name: string;
}

export interface SavingUserNameAction extends Action<StoreActions> {}

export interface AddGameAction extends Action<StoreActions> {
    readonly game: GameItem;
}

export interface SavingGameAction extends Action<StoreActions> {
    readonly saving: boolean;
}

export interface SetGamesAction extends Action<StoreActions> {
    readonly games: ReadonlyArray<GameItem>;
}

export interface LoadingGameAction extends Action<StoreActions> {
    readonly id: number;
    readonly name?: string;
}

export interface SetGameAction extends Action<StoreActions> {
    readonly gameDto: GameDtoModel;
}

export interface SetGameNotFoundAction extends Action<StoreActions> {}

export interface MoveGameAction extends Action<StoreActions> {
    readonly cellIndex: number;
}

export function setUser(user: UserModel): SetUserAction {
    return { type: StoreActionsValue.SetUser, user };
}

export function setUserName(name: string): SetUserNameAction {
    return { type: StoreActionsValue.SetUserName, name };
}

export function savingUserName(): SavingUserNameAction {
    return { type: StoreActionsValue.SavingUserName };
}

export function addGame(game: GameItem): AddGameAction {
    return { type: StoreActionsValue.AddGame, game };
}

export function setGames(games: ReadonlyArray<GameItem>): SetGamesAction {
    return { type: StoreActionsValue.SetGames, games };
}

export function savingGame(saving: boolean): SavingGameAction {
    return { type: StoreActionsValue.SavingGame, saving };
}

export function loadingGame(id: number, name?: string): LoadingGameAction {
    return { type: StoreActionsValue.LoadingGame, id, name };
}

export function setGame(gameDto: GameDtoModel): SetGameAction {
    return { type: StoreActionsValue.SetGame, gameDto };
}

export function setGameNotFound(): SetGameNotFoundAction {
    return { type: StoreActionsValue.SetGameNotFound };
}

export function moveGame(cellIndex: number): MoveGameAction {
    return { type: StoreActionsValue.MoveGame, cellIndex };
}
