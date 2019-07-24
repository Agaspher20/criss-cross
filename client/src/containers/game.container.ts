import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CrissCrossState } from "../store/criss-cross.store";
import { GameProps, GameComponent } from "../components/game.component";
import { makeGameMove } from "../store/thunks/make-game-move";

function mapStateToProps(state: CrissCrossState, ownProps: GameProps): GameProps {
    return {
        ...ownProps,
        model: state.currentGame,
        userId: state.user.id
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: GameProps): GameProps {
    return {
        ...ownProps,
        onMove: makeGameMove(dispatch)
    };
}

export const GameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GameComponent);
