import {colors, createMuiTheme, MuiThemeProvider, withStyles} from "material-ui";
import {inject} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {BackgroundImage} from "./BackgroundImage";
import {PlaybackControls} from "./PlaybackControls";
import {PlaybackInformation} from "./PlaybackInformation";
import {PlaybackProgress} from "./PlaybackProgress";
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

@withStyles(() => {
    return {
        playback: {
            alignItems: "center",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center"
        },
        progress: {
            width: "100%"
        },
        root: {
            backgroundColor: hexToRgba(grey[900], 75),
            display: "flex",
            flexDirection: "column",
            minHeight: "100%"
        }
    };
})
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

        songs
            .getSongs({pageSize: 1})
            .then(() => this.queueRandomSong())
            .then(() => {
                player.callbacks.ended = () => player.playNextSong();
                player.callbacks.canPlay = () => this.queueRandomSong();
            });
    }

    queueRandomSong() {
        const {player, songs} = this.props;
        const page = Math.floor(Math.random() * songs.count) + 1;

        return songs
            .getSongs({page, pageSize: 1})
            .then(songs => songs[0])
            .then(song => player.queueSong(song));
    }

    render() {
        const {classes} = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <BackgroundImage/>
                    <div className={classes.progress}>
                        <PlaybackProgress/>
                    </div>
                    <div className={classes.playback}>
                        <PlaybackControls/>
                        <PlaybackInformation/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}
export default Client;
