import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CrissCrossState } from "../store/criss-cross.store";
import { GameProps, GameComponent } from "../components/game.component";
import { moveGame } from "../store/actions";

function mapStateToProps(state: CrissCrossState, ownProps: GameProps): GameProps {
    return {
        ...ownProps,
        model: state.currentGame
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: GameProps): GameProps {
    return {
        ...ownProps,
        onMove: index => {
            dispatch(moveGame(index));
        }
    };
}

export const GameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GameComponent);
