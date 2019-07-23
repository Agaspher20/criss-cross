import { connect } from "react-redux";
import { CrissCrossState } from "../store/criss-cross.store";
import { UserNameProps, UserName } from "../components/user-name.component";

function mapStateToProps({ user }: CrissCrossState, ownProps: UserNameProps): UserNameProps {
    return {
        ...ownProps,
        name: user.name,
    };
}

export const UserNameContainer = connect(mapStateToProps)(UserName);
