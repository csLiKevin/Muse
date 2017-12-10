import {Button, withStyles} from "material-ui";
import {ChevronLeft, ChevronRight, FirstPage, LastPage} from "material-ui-icons";
import PropTypes from "proptypes";
import queryString from "query-string";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import {clamp} from "../utils/math";


@withStyles((theme) => {
    return {
        buttonFiller: {
            visibility: "hidden"
        },
        buttonText: {
            position: "absolute"
        }
    };
})
@withRouter
export class Pagination extends Component {
    static get propTypes() {
        return {
            changePageCallback: PropTypes.func,
            currentPage: PropTypes.number.isRequired,
            location: PropTypes.object.isRequired,
            match: PropTypes.object.isRequired,
            numPages: PropTypes.number.isRequired
        };
    }

    static get defaultProps() {
        return {
            changePageCallback: () => {}
        };
    }

    get pageButtons() {
        const {classes, currentPage, numPages} = this.props;
        const lowerBound = clamp(currentPage - 5, 1, numPages);
        const upperBound = clamp(lowerBound + 9, 1, numPages);

        const buttons = [];
        for (let page = lowerBound; page <= upperBound; page++) {
            buttons.push(
                <Button
                    className={classes.button}
                    dense
                    disabled={currentPage === page}
                    key={page}
                    onClick={this.createButtonOnClickHandler(page)}
                >
                    <ChevronLeft className={classes.buttonFiller}/>
                    <span className={classes.buttonText}>{page}</span>
                </Button>
            );
        }

        return buttons;
    }

    createButtonOnClickHandler(page) {
        return () => {
            const {changePageCallback, history, location, match} = this.props;
            const parameters = queryString.parse(location.search);
            parameters.page = page;

            history.push({
                pathname: match.path,
                search: queryString.stringify(parameters)
            });

            changePageCallback(page);
        };
    }

    render() {
        const {currentPage, numPages} = this.props;
        const nextPage = clamp(currentPage + 1, 1, numPages);
        const previousPage = clamp(currentPage - 1, 1, numPages);

        return (
            <div>
                <Button
                    dense
                    disabled={currentPage === 1}
                    onClick={this.createButtonOnClickHandler(1)}
                >
                    <FirstPage/>
                </Button>
                <Button
                    dense
                    disabled={currentPage === previousPage}
                    onClick={this.createButtonOnClickHandler(previousPage)}
                >
                    <ChevronLeft/>
                </Button>
                {this.pageButtons}
                <Button
                    dense
                    disabled={currentPage === nextPage}
                    onClick={this.createButtonOnClickHandler(nextPage)}
                >
                    <ChevronRight/>
                </Button>
                <Button
                    dense
                    disabled={currentPage === numPages}
                    onClick={this.createButtonOnClickHandler(numPages)}
                >
                    <LastPage/>
                </Button>
            </div>
        );
    }
}
export default Pagination;
