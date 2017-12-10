import {Card, CardContent, CardMedia, IconButton, Grid, Typography, withStyles} from 'material-ui';
import {AddCircleOutline, PlayCircleOutline} from "material-ui-icons";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import queryString from "query-string";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";
import {Pagination} from "./Pagination";


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
        pagination: {
            textAlign: "center"
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
        player: store.ui.player,
        songList: store.data.songList
    };
})
@observer
export class SongList extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            location: PropTypes.object.isRequired,
            player: PropTypes.object.isRequired,
            songList: PropTypes.object.isRequired
        };
    }

    componentWillMount() {
        const {location, songList} = this.props;
        const parameters = queryString.parse(location.search);
        const page = parameters.page || 1;
        if (!songList.hasSongs) {
            songList.fetchSongs(page);
        }
    }

    createPlaySongHandler(song) {
        return () => {
            this.props.player.playSong(song);
        };
    }

    createQueueSongHandler(song) {
        return () => {
            this.props.player.queueSong(song);
        };
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
                                                <IconButton color="primary" onClick={this.createQueueSongHandler(song)}>
                                                    <AddCircleOutline/>
                                                </IconButton>
                                                <IconButton color="primary" onClick={this.createPlaySongHandler(song)}>
                                                    <PlayCircleOutline/>
                                                </IconButton>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    }
                    <Grid className={classes.pagination} item xs={12}>
                        <Pagination
                            changePageCallback={songList.fetchSongs.bind(songList)}
                            currentPage={songList.page}
                            numPages={songList.numPages}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default SongList;
