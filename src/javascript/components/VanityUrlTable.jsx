import React from 'react';
import {VanityUrlTableData} from './VanityUrlTableData'

class VanityUrlTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentPage:0, pageSize:5};
        this.onChangePage.bind(this);
        this.onChangeRowsPerPage.bind(this);
    }

    onChangePage = (newPage) => {
        this.setState({currentPage: newPage});
    }
    onChangeRowsPerPage = (newRowsPerPage) => {
        this.setState({pageSize: newRowsPerPage})
    }

    render() {
        return (<VanityUrlTableData {...this.props} {...this.state} onChangePage={this.onChangePage} onChangeRowsPerPage={this.onChangeRowsPerPage}/>)
    }
}

export { VanityUrlTable };
