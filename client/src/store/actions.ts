import { Action } from "redux";
import { GameItem, GameDtoModel } from "../model/game.model";
import { UserModel } from "../model/user.model";

export enum StoreActions {
    SetUser = "SET_USER",
    SetUserName = "SET_USER_NAME",
    SavingUserName = "SAVING_USER_NAME",
    AddGame = "ADD_GAME",
    SavingGame = "SAVING_GAME",
    SetGames = "SET_GAMES",
    LoadingGame = "LOADING_GAME",
    SetGame = "SET_GAME",
    SetGameNotFound = "SET_GAME_NOT_FOUND",
    MoveGame = "MOVE_GAME",
}

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
    return { type: StoreActions.SetUser, user };
}

export function setUserName(name: string): SetUserNameAction {
    return { type: StoreActions.SetUserName, name };
}

export function savingUserName(): SavingUserNameAction {
    return { type: StoreActions.SavingUserName };
}

export function addGame(game: GameItem): AddGameAction {
    return { type: StoreActions.AddGame, game };
}

export function setGames(games: ReadonlyArray<GameItem>): SetGamesAction {
    return { type: StoreActions.SetGames, games };
}

export function savingGame(saving: boolean): SavingGameAction {
    return { type: StoreActions.SavingGame, saving };
}

export function loadingGame(id: number, name?: string): LoadingGameAction {
    return { type: StoreActions.LoadingGame, id, name };
}

export function setGame(gameDto: GameDtoModel): SetGameAction {
    return { type: StoreActions.SetGame, gameDto };
}

export function setGameNotFound(): SetGameNotFoundAction {
    return { type: StoreActions.SetGameNotFound };
}

export function moveGame(cellIndex: number): MoveGameAction {
    return { type: StoreActions.MoveGame, cellIndex };
}
