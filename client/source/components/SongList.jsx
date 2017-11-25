import {Card, CardContent, CardMedia, Grid, Typography, withStyles} from 'material-ui';
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {LoadingAnimation} from "./LoadingAnimation";


@withStyles((theme) => {
    return {
        artwork: {
            flexShrink: 0,
            height: "175px",
            width: "175px"
        },
        card: {
            display: "flex"
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
        if (this.props.songList.isLoading) {
            return <LoadingAnimation/>;
        }
        return (
            <Grid container>
                {
                    this.props.songList.songs.map((song) => {
                        return (
                            <Grid item key={song.persistentId} xs={4}>
                                <Card className={this.props.classes.card}>
                                    <CardMedia
                                        className={this.props.classes.artwork}
                                        image="https://via.placeholder.com/175x175"
                                        title={ song.name }
                                    />
                                    <CardContent>
                                        <Typography type="headline">{ song.name }</Typography>
                                        <Typography color="secondary" type="subheading">artist goes here</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        );
    }
}
export default SongList;
