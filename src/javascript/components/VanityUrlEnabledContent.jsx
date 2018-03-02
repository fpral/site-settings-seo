import React from 'react';
import {translate} from 'react-i18next';
import {graphql} from 'react-apollo';
import gql from "graphql-tag";

import { VanityUrlListDefault, VanityUrlListLive } from './VanityUrlList';
import { GQL_VANITY_URL_FIELDS, gqlContentNodeToVanityUrlPairs } from './SeoUtils';

import {
    Button,
    Collapse,
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    withStyles
} from 'material-ui';

import {
    ExpandLess,
    ExpandMore
} from 'material-ui-icons';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit,
    },
    nested: {
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

        this.handleExpandCollapseClick = this.handleExpandCollapseClick.bind(this);
        this.handleFilterSwitchClick = this.handleFilterSwitchClick.bind(this);
        this.beforeQueryingAllVanityUrls = this.beforeQueryingAllVanityUrls.bind(this);
        this.afterQueryingAllVanityUrls = this.afterQueryingAllVanityUrls.bind(this);
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

    beforeQueryingAllVanityUrls(props) {
        return {
            variables: {
                uuid: this.props.content.uuid
            },
            fetchPolicy: 'network-only'
        };
    }

    afterQueryingAllVanityUrls({data, ownProps}) {

        if (!data.jcr) {
            return {
                ...ownProps,
                vanityUrls: []
            };
        }

        this.allVanityUrls = gqlContentNodeToVanityUrlPairs(data.jcr.nodeById);

        return {
            ...ownProps,
            vanityUrls: this.allVanityUrls
        };
    }

    getLocalFilteringDisabledVanityUrlLists(VanityUrlLists) {

        if (this.allVanityUrls) {
            return <VanityUrlLists vanityUrls={this.allVanityUrls} filterText={this.props.filterText}/>
        }

        let query = gql`
            query NodesQuery($uuid: String!) {
                jcr {
                    nodeById(uuid: $uuid) {
                        vanityUrls {
                            ${GQL_VANITY_URL_FIELDS}
                        }
                        liveNode: nodeInWorkspace(workspace: LIVE) {
                            vanityUrls {
                                ${GQL_VANITY_URL_FIELDS}
                            }
                        }
                    }
                }
            }
        `;

        VanityUrlLists = graphql(query, {
            options: this.beforeQueryingAllVanityUrls,
            props: this.afterQueryingAllVanityUrls
        })(VanityUrlLists);

        return <VanityUrlLists filterText={this.props.filterText}/>
    }

    render() {

        const { content, filterText, classes, t } = this.props;

        let filterSwitchButtonLabel = null;
        if (filterText && this.state.expanded) {
            if (this.state.localFilteringEnabled) {
                filterSwitchButtonLabel = t('label.localFilter.switchOff');
            } else {
                filterSwitchButtonLabel = t('label.localFilter.switchOn');
            }
        }

        let vanityUrlLists = null;
        if (this.state.localFilteringEnabled) {
            vanityUrlLists = <VanityUrlLists vanityUrls={content.urls} filterText={filterText}/>;
        } else {
            vanityUrlLists = this.getLocalFilteringDisabledVanityUrlLists(VanityUrlLists);
        }

        return (
            <div className={this.props.classes.root}>
                <Paper elevation={1}>
                    <ListItem onClick={() => this.handleExpandCollapseClick()} >
                        <ListItemIcon>{this.state.expanded ? <ExpandLess/> : <ExpandMore/>}</ListItemIcon>
                        <ListItemText inset primary={content.displayName} secondary={content.path}/>
                        {filterSwitchButtonLabel ? <Button onClick={(e) => this.handleFilterSwitchClick(e)}>{filterSwitchButtonLabel}</Button> : ''}
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
            <Grid container spacing={24}  className={classes.nested}>
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
