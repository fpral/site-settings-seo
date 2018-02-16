import React from 'react';
import {connect, Provider} from 'react-redux'
import {VanityUrlTableData} from './VanityUrlTableData'
import {reducers, store, resetStateReducer} from "@jahia/react-dxcomponents";

class VanityUrlTable extends React.Component {
    constructor(props) {
        super(props);
        this.Component = connect(this.mapStateToProps, this.mapDispatchToProps)(VanityUrlTableData);
    }

    mapStateToProps(state, ownProps) {
        return {
            pageSize: state["pageSize"] ? state["pageSize"] : 5,
            currentPage: state["currentPage"] ? state["currentPage"] : 0,
            path: ownProps.path
        }
    };

    mapDispatchToProps(dispatch, ownProps) {
        return {
            onChangePage(page) {
                dispatch({
                    type: 'SELECT_PAGE',
                    page: page
                })
            },
            onChangeRowsPerPage(pageSize) {
                dispatch({
                    type: 'CHANGE_PAGE_SIZE',
                    pageSize: pageSize
                })
            },

        }
    };

    componentWillMount() {
        reducers["currentPage"] = (state = 0, action) => {
            if (action.type === 'SELECT_PAGE') {
                return action.page
            }
            return state;
        };
        reducers["pageSize"] = (state = 0, action) => {
            if (action.type === 'CHANGE_PAGE_SIZE') {
                return action.pageSize
            }
            return state;
        };
    }

    componentWillUnmount() {
        reducers["currentPage"] = resetStateReducer;
        reducers["pageSize"] = resetStateReducer;
        store.dispatch({type:"RESET_STATE"});
        delete reducers["currentPage"];
    }

    render() {
        let Component = this.Component;
        return (<Provider store={ store }><Component {...this.props}/></Provider>)
    }
}

export { VanityUrlTable };
