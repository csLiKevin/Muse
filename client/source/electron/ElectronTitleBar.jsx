import {Button, withStyles} from "material-ui";
import {Close} from "material-ui-icons"
import React, {Component} from "react";
import PropTypes from "proptypes";

let electronRemote;
try {electronRemote = require("electron").remote;} catch(error) {}


@withStyles(() => ({
    button: {
        "-webkit-app-region": "no-drag"
    },
    root: {
        "-webkit-app-region": "drag",
        textAlign: "right",
        width: "100%"
    }
}))
export class ElectronTitleBar extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired
        };
    }

    render() {
        const {classes} = this.props;

        if (!electronRemote) {
            return null;
        }

        return (
            <div className={classes.root}>
                <Button
                    className={classes.button}
                    onClick={ () => electronRemote.getCurrentWindow().close() }
                    size="small"
                >
                    <Close color="error"/>
                </Button>
            </div>
        );
    }
}
export default ElectronTitleBar;
