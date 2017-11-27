import {CircularProgress, withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";


@withStyles(() => {
    return {
        root: {
            alignItems: "center",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            width: "100%"
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
        const {classes, ...otherProps} = this.props;
        return (
            <div className={classes.root}>
                <CircularProgress {...otherProps}/>
            </div>
        );
    }
}
export default LoadingAnimation;
