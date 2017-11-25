import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";

import {Application} from "./Application";
import {PATHS} from "../utils/constants";


export class Router extends Component {
    render() {
        return (
            <Switch>
                <Route {...PATHS.home} component={Application}/>
                <Route {...PATHS.song} component={Application}/>
                <Route {...PATHS.songList} component={Application}/>
            </Switch>
        );
    }
}
export default Router;
