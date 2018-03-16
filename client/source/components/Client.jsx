import {withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";
import {Route, Switch} from "react-router-dom"

import {PageNotFound} from "./PageNotFound";
import {Player} from "./Player";
import {PlayerPage} from "./PlayerPage";
import {HomePage} from "./HomePage";


@withStyles(() => ({
    root: {
        height: "100%"
    }
}))
export class Client extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired
        };
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <Player />
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/player/" component={PlayerPage}/>
                    <Route component={PageNotFound}/>
                </Switch>
            </div>
        );
    }
}
export default Client;