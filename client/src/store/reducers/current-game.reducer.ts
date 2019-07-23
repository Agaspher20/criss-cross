import { Action } from "redux";
import { GameModel, GameParameters } from "../../model/game.model";
import { StoreActions, StoreActionsValue, MoveGameAction } from "../actions";
import { calculateWinner } from "../../helpers/calculate-winner.helper";

const parameters: GameParameters = {
    sideSize: 4,
    symbolsToWin: 3
};

const defaultGame: GameModel = {
    cells: [],
    exists: false,
    id: -1,
    name: "",
    nextSymbol: "X",
    sideSize: 0,
    stepsCount: 0,
    symbolsToWin: 0
}

export function currentGame(
    state: GameModel = defaultGame,
    action: Action<StoreActions>
): GameModel {
    switch (action.type) {
        case StoreActionsValue.MoveGame:
            return moveGame(state, action as MoveGameAction);
        default:
            return state;
    }
}

function createGame(
    state: ReadonlyArray<GameModel>,
    { game }: any
): ReadonlyArray<GameModel> {
    const { id, name } = game;
    return [{
        id,
        name,
        stepsCount: 0,
        nextSymbol: "X",
        cells: new Array(parameters.sideSize * parameters.sideSize),
        exists: true,
        ...parameters,
    }, ...state];
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
        winner: calculateWinner(currentSymbol, cells, cellIndex, game),
        stepsCount: game.stepsCount + 1
    };
}

function canSetSymbol(i: number, model: GameModel): boolean {
    return !model.cells[i] && !model.winner;
}
