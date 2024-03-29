import { Action } from "redux";
import { GameItem, GameDtoModel, GameMove, GameParameters } from "../model/game.model";
import { UserModel } from "../model/user.model";

export enum StoreActions {
    SetUser = "SET_USER",
    SetUserName = "SET_USER_NAME",
    SavingUserName = "SAVING_USER_NAME",
    UpdateGameList = "UPDATE_GAME_LIST",
    SavingGame = "SAVING_GAME",
    SetGames = "SET_GAMES",
    LoadingGame = "LOADING_GAME",
    SetGame = "SET_GAME",
    SetDefaultGame = "SET_DEFAULT_GAME",
    SetGameNotFound = "SET_GAME_NOT_FOUND",
    MoveGame = "MOVE_GAME",
    EnsureGameName = "ENSURE_GAME_NAME",
    SetGameParameters = "SET_GAME_PARAMETERS"
}

export interface SetUserAction extends Action<StoreActions.SetUser> {
    readonly user: UserModel;
}

export interface SetUserNameAction extends Action<StoreActions.SetUserName> {
    readonly name: string;
}

export interface SavingUserNameAction extends Action<StoreActions.SavingUserName> {}

export interface UpdateGameListAction extends Action<StoreActions.UpdateGameList> {
    readonly game: GameItem;
}

export interface SavingGameAction extends Action<StoreActions.SavingGame> {
    readonly saving: boolean;
}

export interface SetGamesAction extends Action<StoreActions.SetGames> {
    readonly games: ReadonlyArray<GameItem>;
}

export interface LoadingGameAction extends Action<StoreActions.LoadingGame> {
    readonly id: string;
    readonly name?: string;
}

export interface SetGameAction extends Action<StoreActions.SetGame> {
    readonly gameDto: GameDtoModel;
}

export interface SetDefaultGameAction extends Action<StoreActions.SetDefaultGame> {}

export interface SetGameNotFoundAction extends Action<StoreActions.SetGameNotFound> {}

export interface SetGameParametersAction extends Action<StoreActions.SetGameParameters> {
    readonly parameters: GameParameters;
}

export interface MoveGameAction extends Action<StoreActions.MoveGame> {
    readonly move: GameMove;
    readonly isPending: boolean;
}

export interface EnsureGameNameAction extends Action<StoreActions.EnsureGameName> {}

export function setUser(user: UserModel): SetUserAction {
    return { type: StoreActions.SetUser, user };
}

export function setUserName(name: string): SetUserNameAction {
    return { type: StoreActions.SetUserName, name };
}

export function savingUserName(): SavingUserNameAction {
    return { type: StoreActions.SavingUserName };
}

export function updateGameList(game: GameItem): UpdateGameListAction {
    return { type: StoreActions.UpdateGameList, game };
}

export function setGames(games: ReadonlyArray<GameItem>): SetGamesAction {
    return { type: StoreActions.SetGames, games };
}

export function savingGame(saving: boolean): SavingGameAction {
    return { type: StoreActions.SavingGame, saving };
}

export function loadingGame(id: string, name?: string): LoadingGameAction {
    return { type: StoreActions.LoadingGame, id, name };
}

export function setGame(gameDto: GameDtoModel): SetGameAction {
    return { type: StoreActions.SetGame, gameDto };
}

export function setDefaultGame(): SetDefaultGameAction {
    return { type: StoreActions.SetDefaultGame };
}

export function setGameNotFound(): SetGameNotFoundAction {
    return { type: StoreActions.SetGameNotFound };
}

export function setGameParameters(parameters: GameParameters) : SetGameParametersAction {
    return { type: StoreActions.SetGameParameters, parameters };
}

export function moveGame(move: GameMove, isPending: boolean = false): MoveGameAction {
    return { type: StoreActions.MoveGame, move, isPending };
}

export function ensureGameName(): EnsureGameNameAction {
    return { type: StoreActions.EnsureGameName };
}