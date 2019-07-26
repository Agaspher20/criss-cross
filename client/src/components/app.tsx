import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { UserNameContainer } from "../containers/user-name.container";
import { GameListContainer } from "../containers/game-list.container";
import { GameRouteContainer } from "../containers/game-route.container";

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
                <Route path="/game/:id" component={GameRouteContainer}/>
            </Router>
        </div>)
    }
}
