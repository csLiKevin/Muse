import {colors, createMuiTheme, MuiThemeProvider, withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";
import {Route, Switch} from "react-router-dom"

import {AlbumPage} from "./AlbumPage";
import {BackgroundImage} from "./BackgroundImage";
import {HistoryPage} from "./HistoryPage";
import {HomePage} from "./HomePage";
import {Navigation} from "./Navigation";
import {PageNotFound} from "./PageNotFound";
import {PlaybackControls} from "./PlaybackControls";
import {PlaybackProgress} from "./PlaybackProgress";
import {QueuePage} from "./QueuePage";
import {FOOTER_HEIGHT, ROUTES} from "../utils/constants";
import {hexToRgba} from "../utils/functions";


const {green, purple, grey} = colors;
const theme = createMuiTheme({
    palette: {
        action: {
            active: green.A700,
            disabled: grey[400]
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
            secondary: grey[300]
        }
    }
});

@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;

    return {
        action: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between"
        },
        content: {
            flex: 1,
            padding: `${spacingUnit * 2}px`
        },
        footer: {
            backgroundColor: hexToRgba(grey[900], 80),
            bottom: 0,
            position: "fixed",
            width: "100%"
        },
        root: {
            backgroundColor: hexToRgba(grey[900], 90),
            display: "flex",
            minHeight: "100%"
        }
    };
})
export class Client extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);
        this.footer = {};
        this.state = {footerHeight: FOOTER_HEIGHT};
        this.updateFooterSize = this.updateFooterSize.bind(this);
    }

    componentWillMount() {
        window.addEventListener("resize", this.updateFooterSize, true);
    }

    componentDidMount() {
        this.updateFooterSize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateFooterSize, true);
    }

    updateFooterSize() {
        this.setState({footerHeight: this.footer.clientHeight});
    }

    render() {
        const {classes} = this.props;
        const {footerHeight} = this.state;
        const pageStyle = {paddingBottom: `${footerHeight}px`};

        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <BackgroundImage/>
                    <div className={classes.content} style={pageStyle}>
                        <Switch>
                            <Route {...ROUTES.album} component={AlbumPage}/>
                            <Route {...ROUTES.history} component={HistoryPage}/>
                            <Route {...ROUTES.home} component={HomePage}/>
                            <Route {...ROUTES.queue} component={QueuePage}/>
                            <Route component={PageNotFound}/>
                        </Switch>
                    </div>
                    <div className={classes.footer} ref={footer => this.footer = footer}>
                        <PlaybackProgress/>
                        <div className={classes.action}>
                            <PlaybackControls/>
                            <Navigation/>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}
export default Client;
