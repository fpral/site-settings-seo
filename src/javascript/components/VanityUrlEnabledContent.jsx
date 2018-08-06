import React from 'react';
import {translate} from 'react-i18next';
import {VanityUrlListDefault, VanityUrlListLive} from './VanityUrlList';
import {AddVanityUrl} from "./AddVanityUrl";
import {Button, IconButton, Collapse, Grid, Card, CardHeader, CardContent, Typography, withStyles} from '@material-ui/core';
import {KeyboardArrowDown, KeyboardArrowRight} from '@material-ui/icons';

const styles = (theme) => ({
    cardContentRoot: {
        paddingRight: 12,
        paddingLeft: 12
    }
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
                <Typography variant={'caption'}>
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
                <Button variant="contained" color="primary"
                        onClick={(e) => this.handleFilterSwitchClick(e)}
                        data-vud-role="button-filter-switch">
                    {filterSwitchButtonLabel}
                </Button>
            );
        }

        let vanityUrls = this.state.localFilteringEnabled || !content.allUrls ? content.urls : content.allUrls;

        return (
            <Card data-vud-content-uuid={content.uuid}>
                <CardHeader onClick={() => this.handleExpandCollapseClick()}
                            title={content.displayName} subheader={content.path}
                            avatar={this.state.expanded ? <KeyboardArrowDown color={'secondary'} /> : <KeyboardArrowRight color={'secondary'} />}
                            action={this.state.expanded ?
                                <Grid direction={'row'} spacing={8} alignItems={'center'} container>
                                    <Grid item>
                                        {filterMatchInfo}
                                    </Grid>
                                    <Grid item>
                                        {localFilterSwitch}
                                    </Grid>
                                    <Grid item>
                                        <IconButton aria-label={actions.addAction.className}
                                                    onClick={(event) => {event.stopPropagation();actions.addAction.call(content.path, languages);}}>
                                            {actions.addAction.body}
                                            {actions.addAction.buttonIcon}</IconButton>
                                    </Grid>
                                </Grid>: ''}>
                </CardHeader>
                <Collapse in={this.state.expanded} timeout="auto" mountOnEnter unmountOnExit>
                    <CardContent classes={{root: classes.cardContentRoot}}>
                        <Grid direction={'row'} spacing={16} container>
                            <Grid item xs={12} sm={6}>
                                <VanityUrlListDefault onChangeSelection={onChangeSelection} selection={selection} vanityUrls={vanityUrls} filterText={filterText} expanded={this.state.expanded} actions={actions} languages={languages} contentUuid={content.uuid}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <VanityUrlListLive vanityUrls={vanityUrls} filterText={filterText} actions={actions} contentUuid={content.uuid}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}

VanityUrlEnabledContent = withStyles(styles)(translate()(VanityUrlEnabledContent));

export {VanityUrlEnabledContent};
