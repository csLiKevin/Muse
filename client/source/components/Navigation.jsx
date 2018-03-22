import {Tab, Tabs, withStyles} from "material-ui";
import {FormatListNumbered, History, Home} from "material-ui-icons";
import PropTypes from "proptypes";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import {ROUTES} from "../utils/constants";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;

    return {
        root: {
            minWidth: "initial",
            width: `${spacingUnit * 6}px`
        }
    };
})
@withRouter
export class Navigation extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            history: PropTypes.object.isRequired,
            location: PropTypes.object.isRequired
        }
    }

    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, pathname) {
        this.props.history.push(pathname);
    }

    render() {
        const {classes, location: {pathname}} = this.props;
        const tabClassesOverride = {root: classes.root};

        return (
            <Tabs indicatorColor="primary" onChange={this.handleChange} value={pathname} textColor="primary">
                <Tab
                    classes={tabClassesOverride}
                    icon={<History/>}
                    onChange={this.handleChange}
                    value={ROUTES.history.path}
                />
                <Tab
                    classes={tabClassesOverride}
                    icon={<FormatListNumbered/>}
                    onChange={this.handleChange}
                    value={ROUTES.queue.path}
                />
                <Tab
                    classes={tabClassesOverride}
                    icon={<Home/>}
                    onChange={this.handleChange}
                    value={ROUTES.home.path}
                />
            </Tabs>
        );
    }
}
export default Navigation;
