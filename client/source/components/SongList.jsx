import {Card, CardContent, CardMedia, IconButton, Grid, Typography, withStyles} from 'material-ui';
import {Add, PlayArrow} from "material-ui-icons";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";


@withStyles((theme) => {
    const spacingUnit = theme.spacing.unit;
    return {
        artwork: {
            height: "128px",
            width: "128px"
        },
        card: {
            display: "flex"
        },
        controls: {
            flex: 0,
            marginBottom: `-${3 * spacingUnit}px`,
            marginRight: `-${spacingUnit}px`,
            textAlign: "right"
        },
        content: {
            flex: 1,
            overflowX: "hidden",
            whiteSpace: "nowrap"
        },
        contentText: {
            overflowX: "hidden",
            textOverflow: "ellipsis"
        },
        root: {
            paddingBottom: `${spacingUnit}px`,
            paddingLeft: `${spacingUnit}px`,
            paddingRight: `${spacingUnit}px`,
            paddingTop: `${spacingUnit}px`
        }
    };
})
@inject((store) => {
    return {
        songList: store.data.songList
    };
})
@observer
export class SongList extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            songList: PropTypes.object.isRequired
        };
    }

    componentWillMount() {
        this.props.songList.fetchSongs();
    }

    render() {
        const {classes, songList} = this.props;
        if (songList.isLoading) {
            return <LoadingAnimation/>;
        }
        return (
            <div className={classes.root}>
                <Grid container>
                    {
                        songList.songs.map((song) => {
                            return (
                                <Grid item key={song.persistentId} md={3} sm={6} xs={12}>
                                    <Card className={classes.card}>
                                        <CardMedia
                                            className={classes.artwork}
                                            image={song.album.image}
                                            title={song.name}
                                        />
                                        <CardContent className={classes.content}>
                                            <Typography className={classes.contentText} type="headline">
                                                {song.name}
                                            </Typography>
                                            <Typography
                                                className={classes.contentText}
                                                color="secondary"
                                                type="subheading"
                                            >
                                                {song.artist}
                                            </Typography>
                                            <div className={classes.controls}>
                                                <IconButton color="primary">
                                                    <Add/>
                                                </IconButton>
                                                <IconButton color="primary">
                                                    <PlayArrow/>
                                                </IconButton>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            </div>
        );
    }
}
export default SongList;
