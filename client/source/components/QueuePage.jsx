import {Table, TableBody, TableCell, TableRow, Typography} from "material-ui";
import {toJS} from "mobx";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";


@inject(({player: {queue}}) => ({queue: toJS(queue)}))
@observer
export class QueuePage extends Component {
    static get propTypes() {
        return {
            queue: PropTypes.array.isRequired
        };
    }

    render() {
        const {queue} = this.props;

        return (
            <div>
                <Typography variant="title">Queue</Typography>
                {
                    queue.length
                        ? <Table>
                            <TableBody>
                                {
                                    queue.map((song, index) => (
                                        <TableRow key={song.identifier}>
                                            <TableCell>
                                                <Typography color="textSecondary">{index + 1}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{song.name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="textSecondary">{song.album.name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="textSecondary">{song.artist}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        : <Typography color="textSecondary" variant="subheading">is empty</Typography>
                }
            </div>
        );
    }
}
export default QueuePage;
