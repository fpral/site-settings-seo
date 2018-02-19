import React from 'react';
import {VanityUrlList} from './VanityUrlList';

import {
    Collapse,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from 'material-ui';

import {
    ExpandLess,
    ExpandMore
} from 'material-ui-icons';

class VanityUrlEnabledPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleItemClick = () => {
        this.setState({open: !this.state.open});
    };

    render() {
        let page = this.props.page;
        return (
            <div className={this.props.classes.root}>
                <ListItem button onClick={() => this.handleItemClick()} >
                    <ListItemIcon>{this.state.open ? <ExpandLess/> : <ExpandMore/>}</ListItemIcon>
                    <ListItemText inset primary={page.displayName} secondary={page.path}/>
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <Grid container spacing={24} className={this.props.classes.nested}>
                        <Grid item xs={12} lg={6}>
                            <VanityUrlList workspace="default" vanityUrls={page.defaultUrls}/>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <VanityUrlList workspace="live" vanityUrls={page.liveUrls}/>
                        </Grid>
                    </Grid>
                </Collapse>
            </div>
        );
    }
}

export {VanityUrlEnabledPage};
