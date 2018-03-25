import {Table, TableBody, TableCell, TableRow, Typography} from "material-ui";
import {toJS} from "mobx";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";


@inject(({player: {history}}) => ({history: toJS(history)}))
@observer
export class HistoryPage extends Component {
    static get propTypes() {
        return {
            history: PropTypes.array.isRequired
        };
    }

    render() {
        const {history} = this.props;

        return (
            <div>
                <Typography variant="title">History</Typography>
                {
                    history.length
                        ? <Table>
                            <TableBody>
                                {
                                    history.map((song, index) => (
                                        <TableRow key={song.identifier}>
                                            <TableCell>
                                                <Typography color="textSecondary">{history.length - index}</Typography>
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
export default HistoryPage;
