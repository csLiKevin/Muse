import {Grow, Typography, withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";

import {Page} from "./Page";


@withStyles(() => ({
    container: {
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center"
    }
}))
export class PageNotFound extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired
        };
    }

    render() {
        return (
            <Page>
                <Grow in>
                    <div className={this.props.classes.container}>
                        <Typography color="textSecondary" variant="display4">404</Typography>
                    </div>
                </Grow>
            </Page>
        );
    }
}
export default PageNotFound;
