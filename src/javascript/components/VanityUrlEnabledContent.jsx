import React from 'react';

import { VanityUrlListDefault, VanityUrlListLive, } from './VanityUrlList';

import {
    Collapse,
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    withStyles
} from 'material-ui';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit,
    },
    nested: {
        paddingLeft: 64,
        padding: 16,
    },
});

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
        const {content, filterText, classes} = this.props;
        return (
            <div className={this.props.classes.root}>
                <Paper elevation={1}>
                    <ListItem button onClick={() => this.handleItemClick()} >
                        <ListItemIcon>{this.state.open ? <ExpandLess/> : <ExpandMore/>}</ListItemIcon>
                        <ListItemText inset primary={content.displayName} secondary={content.path}/>
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <Grid container spacing={24}  className={classes.nested}>
                            <Grid item xs={12} lg={6}>
                                <VanityUrlListDefault vanityUrls={content.urls} filterText={filterText}/>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <VanityUrlListLive vanityUrls={content.urls} filterText={filterText}/>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Paper>
            </div>
        );
    }
}

VanityUrlEnabledContent = withStyles(styles)(VanityUrlEnabledContent);

export {VanityUrlEnabledContent};
