import {withStyles, Typography} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";
import {Link} from "react-router-dom";


@withStyles(theme => ({
    root: {
        "&:hover": {
            color: theme.palette.primary.main,
            textDecoration: "underline"
        }
    }
}))
export class TextLink extends Component {
    static get propTypes() {
        return {
            children: PropTypes.node,
            classes: PropTypes.object.isRequired,
            className: PropTypes.string,
            color: PropTypes.string,
            variant: PropTypes.string,
            to: PropTypes.string.isRequired
        };
    }

    render() {
        const {children, classes, className, color, variant, to} = this.props;

        return (
            <Link to={to}>
                <Typography className={`${className} ${classes.root}`} color={color} variant={variant}>
                    {children}
                </Typography>
            </Link>
        );
    }
}
export default TextLink;
