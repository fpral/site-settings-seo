import React from 'react';
import {VanityUrlEnabledContent} from './VanityUrlEnabledContent';

import {List} from 'material-ui';

import {Pagination} from "./Pagination";
import {translate} from 'react-i18next';

class VanityUrlTableView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openedItems: {}
        };
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
    }

    handleOpenDialog = (path) => {
        this.setState({open: true, path: path});
    };

    handleCloseDialog = () => {
        this.setState({open: false});
    };

    render() {
        let { rows, selection, onChangeSelection, filterText, actions} = this.props;
        return (
            <div>
                <List>
                    {rows.map(row => (<VanityUrlEnabledContent key={row.uuid} content={row} filterText={filterText} onChangeSelection={onChangeSelection} selection={selection} actions={actions}/>))}
                </List>
                <Pagination {...this.props} />
            </div>
        )
    }
}

VanityUrlTableView = translate('site-settings-seo')(VanityUrlTableView);

export {VanityUrlTableView};
