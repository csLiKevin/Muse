import {observer} from "mobx-react";
import React, {Component} from "react";

import {Queue} from "./Queue";


@observer
export class QueuePage extends Component {
    render() {
        return (
            <div>
                <Queue />
            </div>
        );
    }
}
export default QueuePage;
