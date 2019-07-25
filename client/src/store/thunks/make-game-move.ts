import { Dispatch } from "redux";
import { GameMove } from "../../model/game.model";
import { moveGame } from "../actions";
import { submitMove } from "../../api/game-api-service";

export function makeGameMove(
    dispatch: Dispatch
): (move: GameMove) => Promise<void> {
    return async (move: GameMove) => {
        dispatch(moveGame(move, true));
        submitMove(move);
    };
}
