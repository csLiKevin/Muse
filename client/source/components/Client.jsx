import {colors, createMuiTheme, MuiThemeProvider, withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";
import {Route, Switch} from "react-router-dom"

import {BackgroundImage} from "./BackgroundImage";
import {PageNotFound} from "./PageNotFound";
import {Player} from "./Player";
import {PlayerPage} from "./PlayerPage";
import {HomePage} from "./HomePage";
import {hexToRgba} from "../utils/functions";


const {green, purple, grey} = colors;
const theme = createMuiTheme({
    palette: {
        action: {
            active: hexToRgba(green.A700, 90),
            disabled: hexToRgba(grey[400], 90)
        },
        primary: {
            contrastText: grey[50],
            main: green.A700
        },
        secondary: {
            main: purple[500]
        },
        text: {
            primary: grey[50],
            secondary: hexToRgba(grey[400], 90)
        }
    }
});

@withStyles(() => ({
    root: {
        backgroundColor: hexToRgba(grey[900], 90),
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
            <MuiThemeProvider theme={theme}>
                <div className={this.props.classes.root}>
                    <BackgroundImage/>
                    <Switch>
                        <Route exact path="/" component={HomePage}/>
                        <Route exact path="/player/" component={PlayerPage}/>
                        <Route component={PageNotFound}/>
                    </Switch>
                    <Player />
                </div>
            </MuiThemeProvider>
        );
    }
}
export default Client;