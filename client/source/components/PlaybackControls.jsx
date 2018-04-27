import {IconButton} from 'material-ui';
import {PauseCircleOutline, PlayCircleOutline, SkipNext, SkipPrevious} from "material-ui-icons";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";


@inject(({player}) => ({player}))
@observer
export class PlaybackControls extends Component {
    static get propTypes() {
        return {
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
        const {player} = this.props;
        const {currentSong, hasHistory, hasQueue} = player;
        const {loading, playing} = currentSong.audioStatus;

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
            <div>
                <IconButton color="primary" disabled={!hasHistory} onClick={ this.handlePlayPrevious }>
                    <SkipPrevious/>
                </IconButton>
                <IconButton disabled={!currentSong.file && !hasQueue} onClick={ centerControlOnClick }>
                    {centerControlIcon}
                </IconButton>
                <IconButton disabled={!hasQueue} onClick={ this.handlePlayNext }>
                    <SkipNext/>
                </IconButton>
            </div>
        );
    }
}
export default PlaybackControls;
