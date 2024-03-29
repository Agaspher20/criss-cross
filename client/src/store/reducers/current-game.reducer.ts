import { Action } from "redux";
import { GameModel, GameMove } from "../../model/game.model";
import {
    StoreActions,
    MoveGameAction,
    LoadingGameAction,
    SetGameAction,
    SetGameParametersAction,
} from "../actions";
import { calculateWinner } from "../../helpers/calculate-winner.helper";

export const defaultGame: GameModel = {
    cells: [],
    exists: false,
    loading: false,
    id: "",
    name: "",
    nextSymbol: "X",
    stepsCount: 0,
    sideSize: 10,
    symbolsToWin: 5,
    participantsCount: 0,
    lastUpdate: new Date().getTime()
}

export function currentGame(
    state: GameModel = defaultGame,
    action: Action<StoreActions>
): GameModel {
    switch (action.type) {
        case StoreActions.MoveGame:
            return moveGame(state, action as MoveGameAction);
        case StoreActions.LoadingGame:
            return loadingGame(state, action as LoadingGameAction);
        case StoreActions.SetGame:
            return setGame(state, action as SetGameAction);
        case StoreActions.SetDefaultGame:
            return setDefaultGame();
        case StoreActions.SetGameNotFound:
            return setGameNotFound(state);
        case StoreActions.SetGameParameters:
            return setGameParameters(state, action as SetGameParametersAction);
        default:
            return state;
    }
}

function setGame(
    game: GameModel,
    { gameDto }: SetGameAction
): GameModel {
    const { nextSymbol, lastMoveId, winnerSymbol, winnerName, moves } = gameDto;
    const cellsArray = new Array(game.sideSize * game.sideSize);

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
    { move, isPending }: MoveGameAction,
): GameModel {
    const cells = [...game.cells];
    const { symbol, cellIndex, userId, winnerName } = move;
    cells[cellIndex] = symbol;

    const ensuredGame = !isPending && game.pendingMove && mustRevertPendingMove(move, game.pendingMove) ?
        revertMove(game, game.pendingMove) :
        game;

    return {
        ...ensuredGame,
        cells,
        nextSymbol: symbol === "X" ? "O" : "X",
        lastMoveId: userId,
        winnerSymbol: calculateWinner(symbol, cells, cellIndex, game),
        stepsCount: game.stepsCount + 1,
        pendingMove: isPending ? move : undefined,
        winnerName
    };
}

function revertMove(
    game: GameModel,
    pendingMove: GameMove,
): GameModel {
    const cells = [...game.cells];
    const { cellIndex } = pendingMove;
    cells[cellIndex] = undefined;

    return {
        ...game,
        cells,
        lastMoveId: undefined,
        winnerSymbol: undefined,
        stepsCount: game.stepsCount - 1,
    }
}

function setDefaultGame(): GameModel {
    return defaultGame;
}

function mustRevertPendingMove(move: GameMove, pendingMove: GameMove): boolean {
    return move.symbol === pendingMove.symbol && move.cellIndex !== pendingMove.cellIndex;
}

function setGameParameters(state: GameModel, { parameters }: SetGameParametersAction): GameModel {
    return {
        ...state,
        sideSize: parameters.sideSize,
        symbolsToWin: parameters.symbolsToWin
    };
}
