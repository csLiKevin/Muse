import {Tab, Tabs} from "material-ui";
import {Home, MusicNote} from "material-ui-icons";
import React, {Component} from "react";
import {matchPath, withRouter} from "react-router-dom";

import {PATHS} from "../utils/constants";


@withRouter
export class NavigationBar extends Component {
    constructor(props, context) {
        super(props, context);
        // Determine the initial active tab.
        let path;
        for (const pathOptions of Object.values(PATHS)) {
            if (matchPath(props.location.pathname, pathOptions)) {
                path = pathOptions.path;
                break;
            }
        }
        if (!path) {
            // Redirect to the home page if the location doesn't match any known paths.
            path = PATHS.home.path;
            this.props.history.push(path);
        } else if (path === PATHS.song.path) {
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
        return (
            <Tabs
                centered
                onChange={this.handleChange}
                value={this.state.value}
            >
                <Tab icon={<Home/>} value={PATHS.home.path}/>
                <Tab icon={<MusicNote/>} value={PATHS.songList.path}/>
            </Tabs>
        );
    }
}
export default NavigationBar;
