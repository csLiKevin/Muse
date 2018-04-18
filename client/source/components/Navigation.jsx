import {Tab, Tabs, withStyles} from "material-ui";
import {FormatListNumbered, History, Home} from "material-ui-icons";
import PropTypes from "proptypes";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import {ROUTES} from "../utils/constants";
import {findRoute} from "../utils/functions";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;
    const textPrimary = theme.palette.text.primary;

    return {
        root: {
            minWidth: "initial",
            width: `${spacingUnit * 6}px`
        },
        textColorPrimary: {
            color: textPrimary
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

    get value() {
        const {location: {pathname}} = this.props;

        if (![ROUTES.history.path, ROUTES.home.path, ROUTES.queue.path].includes(findRoute(pathname).path)) {
            return false;
        }
        return pathname;
    }

    handleChange(event, pathname) {
        this.props.history.push(pathname);
    }

    render() {
        const {classes} = this.props;
        const tabClassesOverride = {
            root: classes.root,
            textColorPrimary: classes.textColorPrimary
        };

        return (
            <Tabs indicatorColor="primary" onChange={this.handleChange} value={this.value} textColor="primary">
                <Tab
                    classes={tabClassesOverride}
                    icon={<History/>}
                    value={ROUTES.history.path}
                />
                <Tab
                    classes={tabClassesOverride}
                    icon={<FormatListNumbered/>}
                    value={ROUTES.queue.path}
                />
                <Tab
                    classes={tabClassesOverride}
                    icon={<Home/>}
                    value={ROUTES.home.path}
                />
            </Tabs>
        );
    }
}
export default Navigation;
