import {AppBar, Tab, Tabs, withStyles} from "material-ui";
import {Home, MusicNote} from "material-ui-icons";
import PropTypes from "proptypes";
import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";

import {SongList} from "./SongList";
import {PATHS} from "../utils/constants";


@withStyles((theme) => {
    const tabHeight = 48;
    return {
        content: {
            flex: 1,
            marginBottom: `${tabHeight}px`,
            marginTop: `${tabHeight}px`
        },
        player: {
            backgroundColor: "gray",
            bottom: 0,
            height: `${tabHeight}px`,
            position: "fixed",
            width: "100%"
        },
        root: {
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }
    };
})
@withRouter
export class Application extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            match: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);
        // Determine the initial active tab.
        let path = props.match.path;
        if (path === PATHS.song.path) {
            path = PATHS.songList.path;
        }
        this.state = {
            value: path
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, value) {
        this.setState({value: value});
        this.props.history.push(value);
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={ classes.root }>
                <AppBar>
                    <Tabs onChange={this.handleChange} value={this.state.value}>
                        <Tab icon={<Home/>} value={PATHS.home.path}/>
                        <Tab icon={<MusicNote/>} value={PATHS.songList.path}/>
                    </Tabs>
                </AppBar>
                <div className={classes.content}>
                    <Switch>
                        <Route {...PATHS.home} component={Home}/>
                        <Route {...PATHS.song} component={SongList}/>
                        <Route {...PATHS.songList} component={SongList}/>
                    </Switch>
                </div>
                <div className={classes.player}>
                    Player
                </div>
            </div>
        );
    }
}
export default Application;
