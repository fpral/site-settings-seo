import React from 'react';
import {VanityUrlEnabledContent} from './VanityUrlEnabledContent';

import {
    List,
} from 'material-ui';

import {Pagination} from "./Pagination";
import {translate} from 'react-i18next';

class VanityUrlTableView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openedItems: {}
        };

    }

    handleOpenDialog = (path) => {
        this.setState({open: true, path: path});
    };

    handleCloseDialog = () => {
        this.setState({open: false});
    };

    render() {
        return (
            <div>
                <List>
                    {this.props.rows.map(row => (<VanityUrlEnabledContent key={row.uuid} content={row} filterText={this.props.filterText}/>))}
                </List>
                <Pagination {...this.props} />
            </div>
        )
    }
}

VanityUrlTableView = translate('site-settings-seo')(VanityUrlTableView);

export {VanityUrlTableView};
