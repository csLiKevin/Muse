import {inject, observer} from "mobx-react";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {List} from "./List";


@inject(({player: {history}}) => ({history: history.slice().reverse()}))
@observer
export class History extends Component {
    static get propTypes() {
        return {
            history: PropTypes.array.isRequired
        };
    }

    render() {
        const {history} = this.props;
        const rows = history.map((song, index) => {
            const reverseIndex = history.length - index;
            return {
                key: reverseIndex,
                cells: [
                    {
                        color: "textSecondary",
                        numeric: true,
                        value: reverseIndex
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
        return <List rows={rows} title="History"/>;
    }
}
export default History;
