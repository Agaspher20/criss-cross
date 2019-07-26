import React from "react";
import { RouteComponentProps } from "react-router";
import { GameContainer } from "../containers/game.container";

export interface GameRouteParams {
    readonly id: string;
}
export interface GameRouteProps extends RouteComponentProps<GameRouteParams> {
    readonly name?: string;
    readonly onLoad: (id: string, name?: string) => void;
    readonly onUnload: (id: string) => void;
}

export class GameRouteComponent extends React.Component<GameRouteProps> {
    private get gameId(): string {
        return this.props.match.params.id;
    }

    public componentDidMount(): void {
        this.props.onLoad(this.gameId, this.props.name);
    }

    public componentWillUnmount(): void {
        this.props.onUnload(this.gameId);
    }

    public render(): React.ReactElement {
        return <GameContainer/>
    }
}
