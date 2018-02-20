import React from 'react';
import {VanityUrlEnabledContent} from './VanityUrlEnabledContent';

import {
    List,
    withStyles
} from 'material-ui';

import {Pagination} from "./Pagination";
import {translate} from 'react-i18next';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit,
        backgroundColor: "white"
    },
    nested: {
        paddingLeft: 64,
        padding: 16
    }
});

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
                    {this.props.rows.map(row => (<VanityUrlEnabledContent key={row.uuid} content={row} classes={this.props.classes}/>))}
                </List>
                <Pagination {...this.props} />
            </div>
        )
    }
}

VanityUrlTableView = withStyles(styles)(translate('site-settings-seo')(VanityUrlTableView));

export {VanityUrlTableView};
