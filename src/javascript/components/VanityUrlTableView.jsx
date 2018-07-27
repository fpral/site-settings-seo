import React from 'react';
import {VanityUrlEnabledContent} from './VanityUrlEnabledContent';

import {Grid, List} from '@material-ui/core';

import {Pagination} from "@jahia/react-material";
import {translate} from 'react-i18next';

class VanityUrlTableView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { rows, selection, onChangeSelection, filterText, actions, languages} = this.props;
        return (
            <Grid container spacing={8}>
                {rows.map(row => (
                    <Grid key={row.uuid} item xs={12}>
                        <VanityUrlEnabledContent content={row}
                                                 filterText={filterText} onChangeSelection={onChangeSelection}
                                                 selection={selection} actions={actions} languages={languages}/>
                    </Grid>)
                )}
                <Grid item xs={12}>
                    <Pagination {...this.props} />
                </Grid>
            </Grid>
        )
    }
}

VanityUrlTableView = translate()(VanityUrlTableView);

export {VanityUrlTableView};
