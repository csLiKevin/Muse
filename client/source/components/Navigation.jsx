import {Tab, Tabs, withStyles} from "material-ui";
import {History, PlaylistPlay, QueueMusic} from "material-ui-icons";
import React, {Component} from "react";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;

    return {
        root: {
            minWidth: "initial",
            width: `${spacingUnit * 6}px`
        }
    };
})
export class Navigation extends Component {
    render() {
        const {classes} = this.props;
        return (
            <Tabs value={1} indicatorColor="primary" textColor="primary">
                <Tab icon={<History/>} classes={{ root: classes.root }}/>
                <Tab icon={<PlaylistPlay/>} classes={{ root: classes.root }}/>
                <Tab icon={<QueueMusic/>} classes={{ root: classes.root }}/>
            </Tabs>
        );
    }
}
export default Navigation;
