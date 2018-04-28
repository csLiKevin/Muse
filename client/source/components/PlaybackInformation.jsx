import {Fade, Typography, withStyles} from 'material-ui';
import {inject, observer} from "mobx-react";
import React, {Component} from "react";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;

    return {
        root: {
            padding: `${spacingUnit * 1.5}px`
        },
        text: {
            maxWidth: `${256 - spacingUnit * 1.5 * 2}px`,
            overflowX: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
        }
    };
})
@inject(({player}) => ({player}))
@observer
export class PlaybackInformation extends Component {
    render() {
        const {classes, player} = this.props;
        const {currentSong} = player;

        return (
            <Fade in={Boolean(player._currentSong)}>
                <div className={classes.root}>
                    <Typography className={classes.text} variant="title">
                        {currentSong.name}
                    </Typography>
                    <Typography className={classes.text} color="textSecondary" variant="body1">
                        {currentSong.album.name}
                    </Typography>
                    <Typography className={classes.text} color="textSecondary" variant="body1">
                        {currentSong.artist}
                    </Typography>
                </div>
            </Fade>
        );
    }
}
export default PlaybackInformation;
