import {toJS} from "mobx";
import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {List} from "./List";


@inject(({player: {queue}}) => ({queue: toJS(queue)}))
@observer
export class Queue extends Component {
    static get propTypes() {
        return {
            queue: PropTypes.array.isRequired
        };
    }

    render() {
        const {queue} = this.props;
        const rows = queue.map((song, index) => {
            return {
                cells: [
                    {
                        color: "textSecondary",
                        numeric: true,
                        value: index + 1
                    },
                    {
                        value: song.name,
                        variant: "body2"
                    },
                    {
                        color: "textSecondary",
                        value: song.artist
                    }
                ]
            };
        });
        return <List rows={rows} title="Queue"/>;
    }
}
export default Queue;
