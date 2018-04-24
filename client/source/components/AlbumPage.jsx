import PropTypes from "proptypes";
import {CardMedia, IconButton, Table, TableBody, TableCell, TableRow, Typography, withStyles} from "material-ui";
import {Add, PlayArrow} from "material-ui-icons";
import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;

    return {
        albumCover: {
            height: `${spacingUnit * 16}px`,
            marginRight: `${spacingUnit * 2}px`,
            width: `${spacingUnit * 16}px`
        },
        albumInfo: {
            display: "flex"
        },
        albumText: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        },
        songActions: {
            textAlign: "right"
        }
    };
})
@withRouter
@inject(({albums, player, songs}) => ({albums, player, songs}))
@observer
export class AlbumPage extends Component {
    static get propTypes() {
        return {
            albums: PropTypes.object.isRequired,
            classes: PropTypes.object.isRequired,
            match: PropTypes.object.isRequired,
            player: PropTypes.object.isRequired,
            songs: PropTypes.object.isRequired
        };
    }

    constructor(props, context) {
        super(props, context);
        this.fillerPixelPath = document.body.dataset.fillerPixelPath;
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        const {albums, match: {params: {artist, name}}, songs} = nextProps;
        const filters = {albumArtist: artist, albumName: name};
        albums.getAlbums({artist, name});
        songs.getSongs(filters).then(() => songs.filter(filters));
    }

    get album() {
        const {albums} = this.props;
        return albums.inView[0] || {};
    }

    get songs() {
        const {songs} = this.props;
        return songs.inView;
    }

    render() {
        const{classes, player} = this.props;

        return (
            <div>
                <div className={classes.albumInfo}>
                    <CardMedia
                        className={classes.albumCover}
                        image={this.album.image || this.fillerPixelPath}
                        title={this.album.name}
                    />
                    <div className={classes.albumText}>
                        <Typography variant="title">{this.album.name}</Typography>
                        <Typography color="textSecondary" variant="subheading">{this.album.artist}</Typography>
                    </div>
                </div>
                <Table>
                    <TableBody>
                        {
                            this.songs.map((song, index) => (
                                <TableRow key={song.persistentId}>
                                    <TableCell>
                                        <Typography color="textSecondary">{index + 1}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{song.name}</Typography>
                                    </TableCell>
                                    <TableCell className={classes.songActions}>
                                        <IconButton onClick={() => player.queueSong(song)}>
                                            <Add/>
                                        </IconButton>
                                        <IconButton onClick={() => player.playSong(song)}>
                                            <PlayArrow/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}
export default AlbumPage;
