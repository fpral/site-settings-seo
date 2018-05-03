import React from 'react';
import {translate} from 'react-i18next';

import {VanityUrlListDefault, VanityUrlListLive} from './VanityUrlList';
import {AddVanityUrl} from "./AddVanityUrl";

import {Button, IconButton, Collapse, Grid, ListItem, ListItemIcon, ListItemText, Paper, Typography, withStyles} from 'material-ui';

import {KeyboardArrowDown, KeyboardArrowRight} from 'material-ui-icons';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit
    },
    filterMatchInfo: {
        margin: theme.spacing.unit
    },
	vanityUrlLists: {
        paddingLeft: '45px',
		paddingTop: '12px',
        padding: '26px',
    },
	vanityUrlListHeader: {
        paddingLeft: '13px',
        paddingRight: '10px',
    },
	vanityUrlListHeaderText: {
		paddingLeft: '8px'
	},
	showToggle: {
		color: '#ffffff',
	    background: '#757575',
	    fontSize: '10px',
	    minHeight: 'auto',
	    minWidth: 'auto',
	    padding: '5px',
	    borderRadius: '0',
		'&:hover': {
			backgroundColor: '#595858'
		}
	},
	addVanityButton: {
		color: '#575757',
		'&:hover': {
			backgroundColor: 'transparent',
			color: '#4A4343'
		}
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
        this.setState((state) => ({
            expanded: !state.expanded
        }));
    };

    handleFilterSwitchClick(e) {
        e.stopPropagation();
        this.setState((state) => ({
            localFilteringEnabled: !state.localFilteringEnabled
        }));
    };

    render() {

        const { content, filterText, classes, t, onChangeSelection, selection, actions, languages } = this.props;

        let filterMatchInfo = null;
        let localFilterSwitch = null;

        if (filterText && this.state.expanded) {

            filterMatchInfo = (
                <Typography variant="caption" classes={{caption: classes.filterMatchInfo}}>
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
                <Button className={classes.showToggle} onClick={(e) => this.handleFilterSwitchClick(e)} data-vud-role="button-filter-switch">
                    {filterSwitchButtonLabel}
                </Button>
            );
        }

        let vanityUrls = this.state.localFilteringEnabled || !content.allUrls ? content.urls : content.allUrls
        return (
            <div className={this.props.classes.root} data-vud-content-uuid={content.uuid}>
                <Paper elevation={1}>
                    <ListItem onClick={() => this.handleExpandCollapseClick()} className={classes.vanityUrlListHeader}>

                        {this.state.expanded ? <KeyboardArrowDown color={'secondary'} /> : <KeyboardArrowRight color={'secondary'} />}

                        <ListItemText inset primary={content.displayName} secondary={content.path} className={classes.vanityUrlListHeaderText}/>
                        {filterMatchInfo}
                        {localFilterSwitch}
                        {this.state.expanded ? <IconButton className={classes.addVanityButton} aria-label={actions.addAction.className} onClick={(event) => {
                            event.stopPropagation();
                            actions.addAction.call(content.path, languages);
                        }}>
                            {actions.addAction.body}
                            {actions.addAction.buttonIcon}
                        </IconButton>: ''}

                    </ListItem>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <Grid container spacing={16} className={classes.vanityUrlLists}>
                            <Grid item xs={6}>
                                <VanityUrlListDefault onChangeSelection={onChangeSelection} selection={selection} vanityUrls={vanityUrls} filterText={filterText} expanded={this.state.expanded} actions={actions} languages={languages} contentUuid={content.uuid}/>
                            </Grid>
                            <Grid item xs={6}>
                                <VanityUrlListLive vanityUrls={vanityUrls} filterText={filterText} actions={actions} contentUuid={content.uuid}/>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Paper>
            </div>
        );
    }
}

VanityUrlEnabledContent = withStyles(styles)(translate()(VanityUrlEnabledContent));

export {VanityUrlEnabledContent};
