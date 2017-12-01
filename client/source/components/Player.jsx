import {CardMedia, colors, IconButton, Paper, Typography, withStyles} from 'material-ui';
import {PauseCircleOutline, PlaylistAdd, PlayCircleOutline, SkipNext, SkipPrevious} from "material-ui-icons";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";


@withStyles((theme) => {
    const spacingUnit = theme.spacing.unit;
    return {
        albumCover: {
            flex: "0 0 auto",
            marginBottom: `-${spacingUnit}px`,
            marginLeft: `-${2 * spacingUnit}px`,
            marginRight: `${2 * spacingUnit}px`,
            marginTop: `-${spacingUnit}px`,
            width: "40px"
        },
        controls: {
            flex: "0 0 auto"
        },
        controlsLeft: {
            display: "flex",
            flex: 1
        },
        controlsRight: {
            alignItems: "center",
            display: "flex",
            flex: 1
        },
        duration: {
            flex: "0 0 auto"
        },
        placeholder: {
            flex: 1
        },
        player: {
            display: "none"
        },
        root: {
            alignItems: "center",
            backgroundColor: colors.grey[200],
            display: "flex",
            justifyContent: "center",
            paddingLeft: `${3 * spacingUnit}px`,
            paddingRight: `${3 * spacingUnit}px`
        },
        title: {
            flex: 1
        }
    };
})
@inject((store) => {
    return {
        player: store.ui.player,
        songList: store.data.songList
    };
})
@observer
export class Player extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            player: PropTypes.object.isRequired,
            songList: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);
        this.handleNext = this.handleNext.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.fillerPixelPath = document.body.dataset.fillerPixelPath;
    }

    handleNext() {
        this.props.player.playNextSong();
    }

    handlePause() {
        this.props.player.pauseSong();
    }

    handlePlay() {
        this.props.player.playSong();
    }

    handlePrevious() {
        this.props.player.playPreviousSong();
    }

    render() {
        const {classes, player, songList} = this.props;
        let centerIcon = <PlayCircleOutline/>;
        let centerOnClick = this.handlePlay;
        if (player.audio.isLoading) {
            centerIcon = <LoadingAnimation color="inherit" size={24}/>;
            centerOnClick = null;
        }
        else if (player.isPlaying) {
            centerIcon = <PauseCircleOutline/>;
            centerOnClick = this.handlePause;
        }
        return (
            <Paper className={classes.root}>
                <div className={classes.controlsLeft}>
                    <CardMedia
                        className={classes.albumCover}
                        image={player.currentSong.album.image || this.fillerPixelPath}
                        title={player.currentSong.name}
                    />
                    <Typography className={classes.title} type="body2">
                        {player.currentSong.name}
                    </Typography>
                </div>
                <div className={classes.controls}>
                    <IconButton disabled={!player.hasHistory} onClick={this.handlePrevious}>
                        <SkipPrevious/>
                    </IconButton>
                    <IconButton disabled={!player.hasQueue} onClick={centerOnClick}>
                        {centerIcon}
                    </IconButton>
                    <IconButton disabled={!player.hasQueue} onClick={this.handleNext}>
                        <SkipNext/>
                    </IconButton>
                </div>
                <div className={classes.controlsRight}>
                    {/* TODO: Remove this button. */}
                    <IconButton className={classes.placeholder} onClick={() => player.queueSongs(songList.songs)}>
                        <PlaylistAdd/>
                    </IconButton>
                    <Typography className={classes.duration} type="body2">
                        {player.audio.formattedCurrentTime} / {player.audio.formattedDuration}
                    </Typography>
                </div>
            </Paper>
        );
    }
}
export default Player;
