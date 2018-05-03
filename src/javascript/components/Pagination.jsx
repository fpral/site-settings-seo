import React from 'react';
import {translate} from 'react-i18next';
import {IconButton, TablePagination, Table, TableRow, TableFooter, withStyles} from 'material-ui';

import {FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage} from 'material-ui-icons'

import {PickerViewMaterial, withPickerModel} from '@jahia/react-dxcomponents';
import {compose} from "react-apollo/index";

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
	paginationButton: {
		'&:hover': {
			backgroundColor: 'transparent'
		}
	}
});

const styles = theme => ({
	tablePaginationContainer: {
		border: 'none'
	},
    tablePagination: {
		background: '#eee',
		'& div': {
			boxShadow: 'none',
			background: 'transparent',
			color: '#6d6d6d'
		}
    },
});

class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const {classes, count, page, rowsPerPage, theme} = this.props;

        return (
            <div className={classes.root}>
                <IconButton
					className={classes.paginationButton}
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                    data-vud-role="table-pagination-button-first-page"
                >
                    <FirstPage/>
                </IconButton>
                <IconButton
					className={classes.paginationButton}
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    <KeyboardArrowLeft/>
                </IconButton>
                <IconButton
					className={classes.paginationButton}
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                    data-vud-role="table-pagination-button-next-page"
                >
                    <KeyboardArrowRight/>
                </IconButton>
                <IconButton
					className={classes.paginationButton}
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    <LastPage/>
                </IconButton>
            </div>
        );
    }
}

TablePaginationActions = withStyles(actionsStyles, {withTheme: true})(TablePaginationActions);

class Pagination extends React.Component {

    constructor(props) {
        super(props);
    }

    onChangePage = (event, page) => {
        this.props.onChangePage(page);
    };

    render() {
        let {classes, totalCount, pageSize, currentPage, onChangeRowsPerPage, t} = this.props;
        return <Table>
            <TableFooter>
                <TableRow className={classes.tablePaginationContainer}>
                    <TablePagination
                        className={classes.tablePagination}
						count={totalCount}
                        rowsPerPage={pageSize}
                        page={currentPage}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={(event) => onChangeRowsPerPage(event.target.value)}
                        Actions={TablePaginationActions}
                        labelRowsPerPage={t('label.pagination.rowsPerPage')}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ` + t('label.pagination.of') + ` ${count}`}
                        data-vud-role="table-pagination"
                    />
                </TableRow>
            </TableFooter>
        </Table>
    }
}

Pagination = compose(
    withStyles(styles),
    translate()
)(Pagination);

export {Pagination}
