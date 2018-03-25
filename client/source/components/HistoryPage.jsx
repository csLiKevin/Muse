import {observer} from "mobx-react";
import React, {Component} from "react";

import {History} from "./History";


@observer
export class HistoryPage extends Component {
    render() {
        return (
            <div>
                <History />
            </div>
        );
    }
}
export default HistoryPage;
