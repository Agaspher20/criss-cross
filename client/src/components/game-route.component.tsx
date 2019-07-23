import React from "react";
import { RouteComponentProps } from "react-router";
import { GameContainer } from "../containers/game.container";

interface GameRouteProps {
    name: string;
}

export function GameRouteComponent(props: RouteComponentProps<GameRouteProps>): React.ReactElement {
    return (<GameContainer name={props.match.params.name} ></GameContainer>)
}
