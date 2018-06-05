import {colors, createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core";
import {inject} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component, Fragment} from "react";

import {BackgroundImage} from "./BackgroundImage";
import {LoadingAnimation} from "./LoadingAnimation";
import {PlaybackControls} from "./PlaybackControls";
import {PlaybackInformation} from "./PlaybackInformation";
import {PlaybackProgress} from "./PlaybackProgress";
import {ElectronTitleBar} from "../electron/ElectronTitleBar";
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

@withStyles(() => ({
    information: {
        alignItems: "center",
        display: "flex",
        flex: 1
    },
    progress: {
        width: "100%"
    },
    root: {
        alignItems: "center",
        backgroundColor: hexToRgba(grey[900], 75),
        display: "flex",
        flexDirection: "column",
        minHeight: "100%"
    }
}))
@inject(({player, songs}) => ({player, songs}))
export class Client extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            player: PropTypes.object.isRequired,
            songs: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);

        const {player, songs} = props;

        this.state = {loading: true};
        this.queueRandomSong = this.queueRandomSong.bind(this);
        songs
            .getSongs({pageSize: 1})
            .then(this.queueRandomSong)
            .then(() => {
                player.callbacks.ended = player.playNextSong.bind(player);
                player.callbacks.loadStart = this.queueRandomSong;
                this.setState({loading: false});
            });
    }

    queueRandomSong() {
        const {player, songs} = this.props;
        const page = Math.floor(Math.random() * songs.count) + 1;

        return songs.getSongs({page, pageSize: 1}).then(songs => player.queueSong(songs[0]));
    }

    render() {
        const {classes} = this.props;
        let content;

        if (this.state.loading) {
            content = (
                <div className={classes.information}>
                    <LoadingAnimation/>
                </div>
            );
        } else {
            content = (
                <Fragment>
                    <div className={classes.information}>
                        <PlaybackInformation/>
                    </div>
                    <PlaybackControls/>
                    <div className={classes.progress}>
                        <PlaybackProgress/>
                    </div>
                </Fragment>
            );
        }

        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <ElectronTitleBar/>
                    <BackgroundImage/>
                    {content}
                </div>
            </MuiThemeProvider>
        );
    }
}
export default Client;
