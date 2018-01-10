import React from 'react';
import {connect, Provider} from 'react-redux'
import {VanityUrlsTableData} from './VanityUrlsTableData'
import {reducers, store, resetStateReducer} from "@jahia/react-dxcomponents";

class VanityUrlsTable extends React.Component {
    constructor(props) {
        super(props);
        this.Component = connect(this.mapStateToProps, this.mapDispatchToProps)(VanityUrlsTableData);
    }

    mapStateToProps(state, ownProps) {
        return {
            pageSize: 5,
            currentPage: state["currentPage"] ? state["currentPage"] : 0
        }
    };

    mapDispatchToProps(dispatch, ownProps) {
        return {
            onSelectPage(page) {
                dispatch({
                    type: 'SELECT_PAGE',
                    page: page
                })
            }
        }
    };

    componentWillMount() {
        reducers["currentPage"] = (state = 0, action) => {
            if (action.type === 'SELECT_PAGE') {
                return action.page
            }
            return state;
        }
    }

    componentWillUnmount() {
        reducers["currentPage"] = resetStateReducer;
        store.dispatch({type:"RESET_STATE"});
        delete reducers["currentPage"];
    }

    render() {
        let Component = this.Component;
        return (<Provider store={ store }><Component {...this.props}/></Provider>)
    }
}

export { VanityUrlsTable };
