import {CardMedia, Fade, withStyles} from "material-ui";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";


@withStyles(() => ({
    root: {
        height: "100%",
        position: "absolute",
        width: "100%",
        zIndex: -1
    }
}))
@inject(({player: {currentSong}}) => ({currentSong}))
@observer
export class BackgroundImage extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            currentSong: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);
        this.fillerPixelPath = document.body.dataset.fillerPixelPath;
    }

    render() {
        const {classes, currentSong} = this.props;

        return (
            <Fade in={currentSong.audioStatus.playing}>
                <CardMedia
                    className={classes.root}
                    image={currentSong.album.image || this.fillerPixelPath}
                    title={currentSong.name}
                />
            </Fade>
        );
    }
}
export default BackgroundImage;
