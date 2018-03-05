import React from 'react';
import {translate} from 'react-i18next';

import { VanityUrlListDefault, VanityUrlListLive } from './VanityUrlList';

import {
    Button,
    Collapse,
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
    withStyles
} from 'material-ui';

import {
    ExpandLess,
    ExpandMore
} from 'material-ui-icons';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit
    },
    filterMatchInfo: {
        margin: theme.spacing.unit
    },
    vanityUrlLists: {
        paddingLeft: 64,
        padding: 16,
    },
});

class VanityUrlEnabledContent extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            expanded: false,
            localFilteringEnabled: true
        };
    }

    handleExpandCollapseClick() {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    handleFilterSwitchClick(e) {
        e.stopPropagation();
        this.setState({
            localFilteringEnabled: !this.state.localFilteringEnabled
        });
    };

    render() {

        const { content, filterText, classes, t } = this.props;

        let filterMatchInfo = null;
        let localFilterSwitch = null;

        if (filterText && this.state.expanded) {

            filterMatchInfo = (
                <Typography type="caption" classes={{caption: classes.filterMatchInfo}}>
                    {t('label.filterMatch', {count: content.urls.length, totalCount: content.allUrls.length})}
                </Typography>
            );

            let filterSwitchButtonLabel = null;
            if (this.state.localFilteringEnabled) {
                filterSwitchButtonLabel = t('label.localFilter.switchOff');
            } else {
                filterSwitchButtonLabel = t('label.localFilter.switchOn');
            }
            localFilterSwitch = (
                <Button onClick={(e) => this.handleFilterSwitchClick(e)}>
                    {filterSwitchButtonLabel}
                </Button>
            );
        }

        let vanityUrlLists = null;
        if (this.state.localFilteringEnabled) {
            vanityUrlLists = <VanityUrlLists vanityUrls={content.urls} filterText={filterText}/>;
        } else {
            vanityUrlLists = <VanityUrlLists vanityUrls={content.allUrls} filterText={filterText}/>;
        }

        return (
            <div className={this.props.classes.root}>
                <Paper elevation={1}>
                    <ListItem onClick={() => this.handleExpandCollapseClick()} >
                        <ListItemIcon>{this.state.expanded ? <ExpandLess/> : <ExpandMore/>}</ListItemIcon>
                        <ListItemText inset primary={content.displayName} secondary={content.path}/>
                        {filterMatchInfo}
                        {localFilterSwitch}
                    </ListItem>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        {vanityUrlLists}
                    </Collapse>
                </Paper>
            </div>
        );
    }
}

class VanityUrlLists extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { vanityUrls, filterText, classes} = this.props;

        return (
            <Grid container spacing={24} className={classes.vanityUrlLists}>
                <Grid item xs={12} lg={6}>
                    <VanityUrlListDefault vanityUrls={vanityUrls} filterText={filterText}/>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <VanityUrlListLive vanityUrls={vanityUrls} filterText={filterText}/>
                </Grid>
            </Grid>
        );
    }
}

VanityUrlLists = withStyles(styles)(VanityUrlLists);
VanityUrlEnabledContent = withStyles(styles)(translate('site-settings-seo')(VanityUrlEnabledContent));

export {VanityUrlEnabledContent};
