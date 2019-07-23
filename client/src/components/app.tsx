import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { UserNameInputContainer } from "../containers/user-name-input.container";
import { UserNameContainer } from "../containers/user-name.container";
import { GameNameInputContainer } from "../containers/game-name-input.container";
import { GameListContainer } from "../containers/game-list.container";
import { GameRouteComponent } from "./game-route.component";

export class App extends React.Component {
    public render(): React.ReactElement {
        return (<div>
            <UserNameContainer />
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <hr />
                <Route exact path="/" component={GameListContainer}/>
                <Route path="/game/:name" component={GameRouteComponent}/>
            </Router>
        </div>)
    }
}
