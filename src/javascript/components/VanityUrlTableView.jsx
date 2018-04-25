import React from 'react';
import {VanityUrlEnabledContent} from './VanityUrlEnabledContent';

import {List} from 'material-ui';

import {Pagination} from "./Pagination";
import {translate} from 'react-i18next';

class VanityUrlTableView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { rows, selection, onChangeSelection, filterText, actions, languages} = this.props;
        return (
            <div>
                <List>
                    {rows.map(row => (<VanityUrlEnabledContent key={row.uuid} content={row} filterText={filterText} onChangeSelection={onChangeSelection} selection={selection} actions={actions} languages={languages}/>))}
                </List>
                <Pagination {...this.props} />
            </div>
        )
    }
}

VanityUrlTableView = translate()(VanityUrlTableView);

export {VanityUrlTableView};
