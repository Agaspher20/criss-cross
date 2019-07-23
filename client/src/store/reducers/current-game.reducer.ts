import { Action } from "redux";
import { GameModel, GameParameters } from "../../model/game.model";
import {
    StoreActions,
    StoreActionsValue,
    MoveGameAction,
    LoadingGameAction,
    SetGameAction,
    SetGameNotFoundAction,
} from "../actions";
import { calculateWinner } from "../../helpers/calculate-winner.helper";

const parameters: GameParameters = {
    sideSize: 4,
    symbolsToWin: 3
};

const defaultGame: GameModel = {
    cells: [],
    exists: false,
    loading: false,
    id: -1,
    name: "",
    nextSymbol: "X",
    stepsCount: 0,
    ...parameters
}

export function currentGame(
    state: GameModel = defaultGame,
    action: Action<StoreActions>
): GameModel {
    switch (action.type) {
        case StoreActionsValue.MoveGame:
            return moveGame(state, action as MoveGameAction);
        case StoreActionsValue.LoadingGame:
            return loadingGame(state, action as LoadingGameAction);
        case StoreActionsValue.SetGame:
            return setGame(state, action as SetGameAction);
        case StoreActionsValue.SetGameNotFound:
            return setGameNotFound(state, action as SetGameNotFoundAction);
        default:
            return state;
    }
}

function setGame(
    state: GameModel,
    { gameDto }: SetGameAction
): GameModel {
    const { stepsCount, nextSymbol, lastMoveId, winnerSymbol, winnerName, cells } = gameDto;
    const cellsArray = new Array(parameters.sideSize * parameters.sideSize);

    for(const [index, symbol] of cells) {
        cellsArray[index] = symbol;
    }

    return {
        ...state,
        stepsCount,
        nextSymbol,
        cells: cellsArray,
        exists: true,
        loading: false,
        lastMoveId,
        winnerSymbol,
        winnerName
    };
}

function setGameNotFound(
    state: GameModel,
    action: SetGameNotFoundAction
): GameModel {
    return {
        ...state,
        exists: false,
        loading: false,
    };
}

function loadingGame(
    game: GameModel,
    { id, name }: LoadingGameAction
): GameModel {
    return {
        ...game,
        id,
        name: name || id.toString(),
        loading: true,
    }
}

function moveGame(
    game: GameModel,
    { cellIndex }: MoveGameAction
): GameModel {
    if (!canSetSymbol(cellIndex, game)) {
        return game;
    }
        
    const currentSymbol = game.nextSymbol;
    const cells = [...game.cells];        
    cells[cellIndex] = currentSymbol;

    return {
        ...game,
        cells,
        nextSymbol: currentSymbol === "X" ? "O" : "X",
        winnerSymbol: calculateWinner(currentSymbol, cells, cellIndex, game),
        stepsCount: game.stepsCount + 1
    };
}

function canSetSymbol(i: number, model: GameModel): boolean {
    return !model.cells[i] && !model.winnerSymbol;
}
