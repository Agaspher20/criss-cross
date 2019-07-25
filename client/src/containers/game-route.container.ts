import { connect } from "react-redux";
import { CrissCrossState } from "../store/criss-cross.store";
import { GameRouteProps, GameRouteComponent } from "../components/game-route.component";
import { Dispatch } from "redux";
import { loadGame } from "../store/thunks/load-game";
import { unloadGame } from "../store/thunks/unload-game";

function mapStateToProps(
    { games }: CrissCrossState,
    ownProps: GameRouteProps
): GameRouteProps {
    const id = parseInt(ownProps.match.params.id, 10);
    const game = games.games.find(game => game.id === id);
    return {
        ...ownProps,
        id,
        name: game && game.name
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: GameRouteProps): GameRouteProps {
    return {
        ...ownProps,
        onLoad: loadGame(dispatch),
        onUnload: unloadGame(dispatch),
    };
}

export const GameRouteContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GameRouteComponent);
