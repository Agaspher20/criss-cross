import React from "react";
import { RouteComponentProps } from "react-router";
import { GameContainer } from "../containers/game.container";
import { GameItem } from "../model/game.model";

export interface GameRouteParams {
    readonly id: string;
}
export interface GameRouteProps extends RouteComponentProps<GameRouteParams> {
    readonly id: number;
    readonly name?: string;
    readonly onLoad: (id: number, name?: string) => void;
}

export class GameRouteComponent extends React.Component<GameRouteProps> {
    public componentDidMount(): void {
        this.props.onLoad(this.props.id, this.props.name);
    }

    public render(): React.ReactElement {
        return <GameContainer/>
    }
}
