import {Grow, Typography, withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";


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
        const {classes} = this.props;

        return (
            <Grow in>
                <div className={classes.container}>
                    <Typography color="textSecondary" variant="display4">404</Typography>
                </div>
            </Grow>
        );
    }
}
export default PageNotFound;
