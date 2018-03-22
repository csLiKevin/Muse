import {Fade, IconButton, Typography, withStyles} from 'material-ui';
import {PauseCircleOutline, PlayCircleOutline, SkipNext, SkipPrevious, VolumeUp} from "material-ui-icons";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";
import {formatTime} from "../utils/functions";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;

    return {
        text: {
            display: "inline-block",
            marginLeft: `${1.5 * spacingUnit}px`,
            marginRight: `${1.5 * spacingUnit}px`
        },
        textContainer: {
            display: "inline-block"
        }
    };
})
@inject(({player}) => ({player}))
@observer
export class PlaybackControls extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            player: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);
        this.handlePause = this.handlePause.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePlayNext = this.handlePlayNext.bind(this);
        this.handlePlayPrevious = this.handlePlayPrevious.bind(this);
    }

    handlePause() {
        this.props.player.pauseSong();
    }

    handlePlay() {
        this.props.player.playSong();
    }

    handlePlayNext() {
        this.props.player.playNextSong();
    }

    handlePlayPrevious() {
        this.props.player.playPreviousSong();
    }

    render() {
        const {classes, player} = this.props;
        const {currentSong, hasHistory, hasQueue} = player;
        const {currentTime, duration, loading, playing} = currentSong.audioStatus;

        let centerControlIcon = <PlayCircleOutline/>;
        let centerControlOnClick = this.handlePlay;
        if (loading) {
            centerControlIcon = <LoadingAnimation color="inherit" size={24}/>;
            centerControlOnClick = null;
        }
        else if (playing) {
            centerControlIcon = <PauseCircleOutline/>;
            centerControlOnClick = this.handlePause;
        }

        return (
            <div className={classes.root}>
                <IconButton color="primary" disabled={!hasHistory} onClick={ this.handlePlayPrevious }>
                    <SkipPrevious/>
                </IconButton>
                <IconButton disabled={!currentSong.file && !hasQueue} onClick={ centerControlOnClick }>
                    {centerControlIcon}
                </IconButton>
                <IconButton disabled={!hasQueue} onClick={ this.handlePlayNext }>
                    <SkipNext/>
                </IconButton>
                <IconButton disabled>
                    <VolumeUp/>
                </IconButton>
                <Fade in={duration > 0}>
                    <div className={classes.textContainer}>
                        <Typography className={classes.text} variant="body2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </Typography>
                        <Typography className={classes.text} variant="body2">
                            {currentSong.name}
                        </Typography>
                        <Typography className={classes.text} color="textSecondary">
                            {currentSong.album.name}
                        </Typography>
                    </div>
                </Fade>
            </div>
        );
    }
}
export default PlaybackControls;