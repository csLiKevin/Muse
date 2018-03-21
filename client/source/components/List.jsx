import {Typography, withStyles} from "material-ui";
import PropTypes from "proptypes";
import React, {Component} from "react";


@withStyles(theme => {
    const spacingUnit = theme.spacing.unit;
    const text = {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        marginLeft: `${spacingUnit}px`,
        marginRight: `${spacingUnit}px`
    };
    return {
        number: {
            ...text,
            width: `${spacingUnit * 4}px`
        },
        row: {
            display: "flex",
            minHeight: `${spacingUnit * 4}px`
        },
        text
    };
})
export class List extends Component {
    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            rows: PropTypes.array.isRequired,
            title: PropTypes.string
        };
    }

    render() {
        const {classes, rows, title} = this.props;
        return (
            <div>
                <Typography variant="title">{title}</Typography>
                {
                    rows.map((row, index) => {
                        return (
                            <div className={classes.row} key={row.key || index}>
                                {
                                    row.cells.map((cell, index) => (
                                        <div
                                            className={cell.numeric ? classes.number : classes.text}
                                            key={cell.key || index}
                                        >
                                            <Typography
                                                color={cell.color}
                                                variant={cell.variant}
                                            >
                                                {cell.value}
                                            </Typography>
                                        </div>
                                    ))
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
export default List;
