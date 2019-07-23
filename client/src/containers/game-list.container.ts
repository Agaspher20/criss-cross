import { connect } from "react-redux";
import { CrissCrossState } from "../store/criss-cross.store";
import { GameListComponent } from "../components/game-list.component";
import { GameListModel } from "../model/game-list.model";

function mapStateToProps(state: CrissCrossState): GameListModel {
    return state.games;
}

export const GameListContainer = connect(mapStateToProps)(GameListComponent);
