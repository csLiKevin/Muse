import {Fade, LinearProgress, withStyles} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;

    return {
        root: {
            height: `${spacingUnit / 2}px`
        }
    };
})
@inject(({player: {currentSong: {audioStatus: {currentTime, duration}}}}) => ({currentTime, duration}))
@observer
export class PlaybackProgress extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            currentTime: PropTypes.number.isRequired,
            duration: PropTypes.number.isRequired
        };
    }

    render() {
        const {classes, currentTime, duration} = this.props;
        const playbackProgress = currentTime / duration * 100 || 0;

        return (
            <Fade in={duration > 0}>
                <LinearProgress
                    className={classes.root}
                    value={playbackProgress}
                    variant="determinate"
                />
            </Fade>
        );
    }
}
export default PlaybackProgress;
