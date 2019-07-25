import { Action } from "redux";
import { GameModel, GameParameters } from "../../model/game.model";
import {
    StoreActions,
    MoveGameAction,
    LoadingGameAction,
    SetGameAction,
    SetLastMoveIdAction
} from "../actions";
import { calculateWinner } from "../../helpers/calculate-winner.helper";

const parameters: GameParameters = {
    sideSize: 4,
    symbolsToWin: 3
};

export const defaultGame: GameModel = {
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
        case StoreActions.SetLastMoveId:
            return setLastMoveId(state, action as SetLastMoveIdAction);
        case StoreActions.MoveGame:
            return moveGame(state, action as MoveGameAction);
        case StoreActions.LoadingGame:
            return loadingGame(state, action as LoadingGameAction);
        case StoreActions.SetGame:
            return setGame(state, action as SetGameAction);
        case StoreActions.SetGameNotFound:
            return setGameNotFound(state);
        default:
            return state;
    }
}

function setGame(
    game: GameModel,
    { gameDto }: SetGameAction
): GameModel {
    const { nextSymbol, lastMoveId, winnerSymbol, winnerName, moves } = gameDto;
    const cellsArray = new Array(parameters.sideSize * parameters.sideSize);

    for(const { cellIndex, symbol } of moves) {
        cellsArray[cellIndex] = symbol;
    }

    return {
        ...game,
        stepsCount: moves.length,
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
    game: GameModel
): GameModel {
    return {
        ...game,
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
        name: name || "",
        loading: true,
    }
}

function moveGame(
    game: GameModel,
    { move }: MoveGameAction
): GameModel {
    const cells = [...game.cells];
    const { symbol, cellIndex, userId, winnerName } = move;
    cells[cellIndex] = symbol;

    return {
        ...game,
        cells,
        nextSymbol: symbol === "X" ? "O" : "X",
        lastMoveId: userId,
        winnerSymbol: calculateWinner(symbol, cells, cellIndex, game),
        stepsCount: game.stepsCount + 1,
        winnerName
    };
}

function setLastMoveId(
    game: GameModel,
    { lastMoveId }: SetLastMoveIdAction
): GameModel {
    return {
        ...game,
        lastMoveId
    };
}