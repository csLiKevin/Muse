import {withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {PLAYER_HEIGHT} from "../utils/constants";


@withStyles(() => ({
    root: {
        height: `calc(100% - ${PLAYER_HEIGHT}px)`
    }
}))
export class Page extends Component {
    static get propTypes() {
        return {
            children: PropTypes.node,
            classes: PropTypes.object.isRequired
        };
    }

    render() {
        const {classes, children} = this.props;
        return (
            <div className={classes.root}>
                {children}
            </div>
        );
    }
}
export default Page;
