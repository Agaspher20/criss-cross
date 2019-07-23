import { Action, Store } from "redux";
import { GameModel, GameItem } from "../model/game.model";

export type StoreActions =
    | "SET_USER_NAME"
    | "SAVING_USER_NAME"
    | "ADD_GAME"
    | "SAVING_GAME"
    | "SET_GAMES"
    | "MOVE_GAME";

interface StoreActionsValueInterface {
    readonly SetUserName: StoreActions;
    readonly SavingUserName: StoreActions;
    readonly AddGame: StoreActions;
    readonly SavingGame: StoreActions;
    readonly SetGames: StoreActions;
    readonly MoveGame: StoreActions;
}

export const StoreActionsValue: StoreActionsValueInterface = {
    SetUserName: "SET_USER_NAME",
    SavingUserName: "SAVING_USER_NAME",
    AddGame: "ADD_GAME",
    SavingGame: "SAVING_GAME",
    SetGames: "SET_GAMES",
    MoveGame: "MOVE_GAME",
};

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

export interface MoveGameAction extends Action<StoreActions> {
    readonly cellIndex: number;
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

export function moveGame(cellIndex: number): MoveGameAction {
    return { type: StoreActionsValue.MoveGame, cellIndex };
}
