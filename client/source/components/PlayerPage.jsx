import {observer} from "mobx-react";
import React, {Component} from "react";

import {History} from "./History";
import {Queue} from "./Queue";


@observer
export class PlayerPage extends Component {
    render() {
        return (
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}><History /></div>
                <div style={{flex: 1}}><Queue/></div>
            </div>
        );
    }
}
export default PlayerPage;
