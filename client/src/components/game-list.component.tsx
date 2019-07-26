import React from "react";
import { GameItem } from "../model/game.model";
import { Link } from "react-router-dom";
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

    private renderGameItem({ id, name, participantsCount, lastUpdate }: GameItem): React.ReactElement {
        return (<li key={id}>
            <p><Link to={`/game/${id}`}>{name}</Link></p>
            <p>Participants count: {participantsCount}</p>
            { this.renderLastUpdate(lastUpdate) }
            <hr/>
        </li>);
    }

    private renderLastUpdate(lastUpdate?: number): React.ReactElement | null {
        if (lastUpdate) {
            const updateDate = new Date(lastUpdate);
            return (<p>Last move: {updateDate.toLocaleDateString()}&nbsp;{updateDate.toLocaleTimeString()}</p>)
        } else {
            return (null);
        }
    }
}
