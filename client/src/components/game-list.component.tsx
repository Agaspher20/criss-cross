import React from "react";
import { GameItem } from "../model/game.model";
import { Link } from "react-router-dom";
import { UserNameInputContainer } from "../containers/user-name-input.container";
import { GameNameInputContainer } from "../containers/game-name-input.container";
import { GameListModel } from "../model/game-list.model";

export class GameListComponent extends React.Component<GameListModel> {
    public render(): React.ReactElement {
        return (<div>
            <GameNameInputContainer placeHolder="Enter the name of the game..." message="Submit game" />
            { this.props.loadingGames ? this.renderLoadingMessage() : this.renderGameList() }
        </div>);
    }

    private renderLoadingMessage(): React.ReactElement {
        return <div>Loading...</div>;
    }

    private renderGameList(): React.ReactElement {
        return <ul>{ (this.props.games || []).map(game => this.renderGameItem(game)) }</ul>;
    }

    private renderGameItem({ name }: GameItem): React.ReactElement {
        return (<li key={name}><Link to={`/game/${name}`}>{name}</Link></li>);
    }
}
