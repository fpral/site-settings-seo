import React from 'react';
import VanityUrlEnabledContent from './VanityUrlEnabledContent';

import {List} from '@material-ui/core';

import {Pagination} from '@jahia/react-material';
import {translate} from 'react-i18next';

class VanityUrlTableView extends React.Component {
    render() {
        let {rows, selection, onChangeSelection, filterText, actions, languages} = this.props;
        return (
            <div>
                <List>
                    {rows.map(row => (
                        <VanityUrlEnabledContent
                            key={row.uuid}
                            content={row}
                            filterText={filterText}
                            selection={selection}
                            actions={actions}
                            languages={languages}
                            onChangeSelection={onChangeSelection}
                        />
                    ))}
                </List>
                <Pagination {...this.props}/>
            </div>
        );
    }
}

export default translate()(VanityUrlTableView);
