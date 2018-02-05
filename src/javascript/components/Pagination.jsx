import React from 'react';
import {IconButton, TablePagination, Table, TableRow, TableFooter, withStyles} from 'material-ui';

import {FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage} from 'material-ui-icons'

import {PickerViewMaterial, withPickerModel} from '@jahia/react-dxcomponents';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const {classes, count, page, rowsPerPage, theme} = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    {theme.direction === 'rtl' ? <LastPage/> : <FirstPage/>}
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    {theme.direction === 'rtl' ? <FirstPage/> : <LastPage/>}
                </IconButton>
            </div>
        );
    }
}

TablePaginationActions = withStyles(actionsStyles, {withTheme: true})(TablePaginationActions);

let Pagination = (props) =>
    <Table>
        <TableFooter>
            <TableRow>
            <TablePagination
                count={props.totalCount}
                rowsPerPage={props.pageSize}
                page={props.currentPage}
                onChangePage={props.onChangePage}
                onChangeRowsPerPage={(event) => props.onChangeRowsPerPage(event.target.value)}
                Actions={TablePaginationActions}
            />
            </TableRow>
        </TableFooter>
    </Table>
;


export {Pagination}