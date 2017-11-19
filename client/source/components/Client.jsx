import {Grid, withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";

import {Home} from "./Home";
import {NavigationBar} from "./NavigationBar";
import {SongList} from "./SongList";
import {PATHS} from "../utils/constants";


@withStyles((theme) => {
    const spacingUnit = theme.spacing.unit;
    return {
        client: {
            height: "100%"
        },
        container: {
            height: "100%",
            marginLeft: `${spacingUnit}px`,
            marginRight: `${spacingUnit}px`
        },
        content: {
            flex: 1,
            width: "100%"
        },
        navigation: {
            flex: 0,
            width: "100%"
        }
    };
})
export class Client extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired
        };
    }

    render() {
        return (
            <div className={this.props.classes.container}>
                <Grid
                    alignItems="center"
                    className={this.props.classes.client}
                    container
                    direction="column"
                    justify="center"
                >
                    <Grid className={this.props.classes.navigation} item xs>
                        <NavigationBar />
                    </Grid>
                    <Grid className={this.props.classes.content} item xs>
                        <Switch>
                            <Route {...PATHS.home} component={Home}/>
                            <Route {...PATHS.song} component={SongList}/>
                            <Route {...PATHS.songList} component={SongList}/>
                        </Switch>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default Client;
