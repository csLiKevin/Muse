import {CardMedia, Fade, withStyles} from "@material-ui/core";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";


@withStyles(() => ({
    root: {
        height: "100%",
        position: "fixed",
        width: "100%",
        zIndex: -1
    }
}))
@inject(({player}) => ({player}))
@observer
export class BackgroundImage extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            player: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);
        this.fillerPixelPath = document.body.dataset.fillerPixelPath;
    }

    render() {
        const {classes, player} = this.props;
        const {currentSong} = player;

        return (
            <Fade in={Boolean(player._currentSong)}>
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
