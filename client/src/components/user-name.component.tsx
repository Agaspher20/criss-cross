import React from "react";
import { UserNameInputContainer } from "../containers/user-name-input.container";

export interface UserNameProps {
    name?: string;
}

export function UserName({ name }: UserNameProps): React.ReactElement {
    return name
        ? (<h3>Your name: {name}</h3>)
        : (<UserNameInputContainer placeHolder="Enter your name..." message="Submit name" />);
}
