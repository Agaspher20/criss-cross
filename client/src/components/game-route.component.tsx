import React from "react";
import { RouteComponentProps } from "react-router";
import { GameContainer } from "../containers/game.container";

export interface GameRouteParams {
    readonly id: string;
}
export interface GameRouteProps extends RouteComponentProps<GameRouteParams> {
    readonly id: number;
    readonly name?: string;
    readonly onLoad: (id: number, name?: string) => void;
    readonly onUnload: (id: number) => void;
}

export class GameRouteComponent extends React.Component<GameRouteProps> {
    public componentDidMount(): void {
        this.props.onLoad(this.props.id, this.props.name);
    }

    public componentWillUnmount(): void {
        this.props.onUnload(this.props.id);
    }

    public render(): React.ReactElement {
        return <GameContainer/>
    }
}
