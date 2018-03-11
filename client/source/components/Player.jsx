import {Card, CardContent, CardMedia, IconButton, LinearProgress, Typography, withStyles} from 'material-ui';
import {PlayCircleOutline, PauseCircleOutline, SkipNext, SkipPrevious} from "material-ui-icons";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";
import {formatTime} from "../utils/functions";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;
    return {
        controls: {
            alignItems: "center",
            display: "flex"
        },
        cover: {
            width: `${12 * spacingUnit}px`
        },
        duration: {
            alignItems: "center",
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            marginLeft: `${2 * spacingUnit}px`,
            marginRight: `${2 * spacingUnit}px`
        },
        information: {
            flex: 1,
            minHeight: "44px"
        },
        progress: {
            height: `${spacingUnit / 4}px`,
            position: "absolute",
            width: "100%"
        },
        root: {
            display: "flex",
            flexWrap: "wrap"
        }
    };
})
@inject(({player}) => ({player}))
@observer
export class Player extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            player: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);
        this.fillerPixelPath = document.body.dataset.fillerPixelPath;
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

        const playbackProgress = currentTime / duration * 100 || 0;

        return (
            <Card className={classes.root}>
                {
                    currentSong.file &&
                    <LinearProgress
                        className={classes.progress}
                        value={playbackProgress}
                        variant="determinate"
                    />
                }
                <CardMedia
                    className={classes.cover}
                    image={currentSong.album.image || this.fillerPixelPath}
                    title={currentSong.name}
                />
                <CardContent className={classes.information}>
                    <Typography variant="body2">{currentSong.name}</Typography>
                    <Typography color="textSecondary">{currentSong.artist}</Typography>
                </CardContent>
                <div className={classes.controls}>
                    <IconButton disabled={!hasHistory} onClick={ this.handlePlayPrevious }>
                        <SkipPrevious/>
                    </IconButton>
                    <IconButton disabled={!currentSong.file && !hasQueue} onClick={ centerControlOnClick }>
                        {centerControlIcon}
                    </IconButton>
                    <IconButton disabled={!hasQueue} onClick={ this.handlePlayNext }>
                        <SkipNext/>
                    </IconButton>
                </div>
                <div className={classes.duration}>
                    <Typography variant="body2">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </Typography>
                </div>
            </Card>
        );
    }
}
export default Player;