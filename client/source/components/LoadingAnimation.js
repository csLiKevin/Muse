import {CircularProgress, Grid, withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";


@withStyles(() => {
    return {
        container: {
            height: "100%"
        }
    };
})
export class LoadingAnimation extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired
        };
    }

    render() {
        return (
            <Grid
                alignItems="center"
                className={this.props.classes.container}
                container
                justify="center"
            >
                <Grid item>
                    <CircularProgress/>
                </Grid>
            </Grid>
        );
    }
}
export default LoadingAnimation;
