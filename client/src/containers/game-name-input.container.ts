import { Dispatch } from "redux";
import { connect } from "react-redux";
import { NameInputProps, NameInputComponent } from "../components/name-input.component";
import { CrissCrossState } from "../store/criss-cross.store";
import { submitGameThunk } from "../store/thunks/submit-game";

function mapStateToProps({ games }: CrissCrossState, ownProps: NameInputProps): NameInputProps {
    return {
        ...ownProps,
        disabled: games.savingGame,
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: NameInputProps): NameInputProps {
    return {
        ...ownProps,
        onSubmit: submitGameThunk(dispatch)
    };
}

export const GameNameInputContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NameInputComponent);
