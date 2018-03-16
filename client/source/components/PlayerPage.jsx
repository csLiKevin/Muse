import {observer} from "mobx-react";
import React, {Component} from "react";

import {History} from "./History";
import {Page} from "./Page";
import {Queue} from "./Queue";


@observer
export class PlayerPage extends Component {
    render() {
        return (
            <Page>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1}}><History /></div>
                    <div style={{flex: 1}}><Queue/></div>
                </div>
            </Page>
        );
    }
}
export default PlayerPage;
