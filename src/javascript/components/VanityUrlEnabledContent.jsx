import React from 'react';

import {
    VanityUrlListDefault,
    VanityUrlListLive,
} from './VanityUrlList';

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

class VanityUrlEnabledContent extends React.Component {

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
        let content = this.props.content;
        return (
            <div className={this.props.classes.root}>
                <ListItem button onClick={() => this.handleItemClick()} >
                    <ListItemIcon>{this.state.open ? <ExpandLess/> : <ExpandMore/>}</ListItemIcon>
                    <ListItemText inset primary={content.displayName} secondary={content.path}/>
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <Grid container spacing={24} className={this.props.classes.nested}>
                        <Grid item xs={12} lg={6}>
                            <VanityUrlListDefault vanityUrls={content.urls}/>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <VanityUrlListLive vanityUrls={content.urls}/>
                        </Grid>
                    </Grid>
                </Collapse>
            </div>
        );
    }
}

export {VanityUrlEnabledContent};
