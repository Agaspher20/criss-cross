import { Dispatch } from "redux";
import { connect } from "react-redux";
import { NameInputProps, NameInputComponent } from "../components/name-input.component";
import { submitUserNameThunk } from "../store/thunks/submit-user-name";
import { CrissCrossState } from "../store/criss-cross.store";

function mapStateToProps({ user }: CrissCrossState, ownProps: NameInputProps): NameInputProps {
    return {
        ...ownProps,
        disabled: user.savingName,
    };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: NameInputProps): NameInputProps {
    return {
        ...ownProps,
        onSubmit: submitUserNameThunk(dispatch),
    };
}

export const UserNameInputContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NameInputComponent);
