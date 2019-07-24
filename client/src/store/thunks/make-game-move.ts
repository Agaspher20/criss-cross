import { Dispatch } from "redux";
import { GameMove } from "../../model/game.model";
import { setLastMoveId, moveGame } from "../actions";
import { submitMove } from "../../api/game-api-service";

export function makeGameMove(
    dispatch: Dispatch
): (move: GameMove) => Promise<void> {
    return async (move: GameMove) => {
        dispatch(setLastMoveId(move.userId));
        submitMove(move);
        dispatch(moveGame(move.cellIndex));
    };
}
