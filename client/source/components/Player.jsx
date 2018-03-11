import {Card, CardContent, CardMedia, IconButton, Typography, withStyles} from 'material-ui';
import {PlayCircleOutline, PauseCircleOutline, SkipNext, SkipPrevious} from "material-ui-icons";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";


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
        root: {
            display: "flex"
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
        this.handlePlayPrevious = this.handlePlayPrevious.bind(this);
        this.handlePlayNext = this.handlePlayNext.bind(this);
    }

    handlePlayPrevious() {
        this.props.player.playPreviousSong();
    }

    handlePlayNext() {
        this.props.player.playNextSong();
    }

    render() {
        const {classes, player} = this.props;
        const {currentSong, hasHistory, hasQueue, pauseSong, playSong} = player;

        let centerControlIcon = <PlayCircleOutline/>;
        let centerControlOnClick = playSong.bind(player);
        if (currentSong.audioStatus.loading) {
            centerControlIcon = <LoadingAnimation color="inherit" size={24}/>;
            centerControlOnClick = null;
        }
        else if (currentSong.audioStatus.playing) {
            centerControlIcon = <PauseCircleOutline/>;
            centerControlOnClick = pauseSong.bind(player);
        }

        return (
            <Card className={classes.root}>
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
                        {currentSong.audioStatus.currentTime} / {currentSong.audioStatus.duration}
                    </Typography>
                </div>
            </Card>
        );
    }
}
export default Player;