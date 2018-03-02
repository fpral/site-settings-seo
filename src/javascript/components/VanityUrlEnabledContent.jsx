import React from 'react';
import {translate} from 'react-i18next';
import {graphql} from 'react-apollo';
import gql from "graphql-tag";
import * as _ from "lodash";

import { VanityUrlListDefault, VanityUrlListLive } from './VanityUrlList';

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
    }

    handleExpandCollapseClick = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    propsToOptions = (props) => {
        return {
            variables: {
                uuid: this.props.content.uuid
            },
            fetchPolicy: 'network-only'
        }
    }

    resultsToProps = ({data, ownProps}) => {

        if (!data.jcr) {
            return {
                ...ownProps,
                vanityUrls: [],
                filterText: this.props.filterText
            };
        }

        let contentNode = data.jcr.nodeById;
        let defaultUrls = _.keyBy(_.map(contentNode.vanityUrls, vanityUrlNode => ({uuid: vanityUrlNode.uuid, default: vanityUrlNode})), 'uuid');
        let liveUrls = contentNode.liveNode ? _.keyBy(_.map(contentNode.liveNode.vanityUrls, vanityUrlNode => ({uuid:vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid') : {};
        let urlPairs = _.merge(defaultUrls, liveUrls);
        urlPairs = _.sortBy(urlPairs, urlPair => (urlPair.default ? urlPair.default.language : urlPair.live.language));

        return {
            ...ownProps,
            vanityUrls: _.values(urlPairs),
            filterText: this.props.filterText
        };
    }

    getLocalFilteringDisabledVanityUrlLists(VanityUrlLists) {

        let query = gql`
            query NodesQuery($uuid: String!) {
                jcr {
                    nodeById(uuid: $uuid) {
                        vanityUrls {
                            active
                            default
                            url
                            language
                            uuid
                            path
                        }
                        liveNode: nodeInWorkspace(workspace: LIVE) {
                            vanityUrls {
                                active
                                default
                                url
                                language
                                uuid
                                path
                            }
                        }
                    }
                }
            }
        `;

        VanityUrlLists = graphql(query, {
            options: this.propsToOptions,
            props: this.resultsToProps
        })(VanityUrlLists);

        return <VanityUrlLists/>
    }

    handleFilterSwitchClick = (e) => {
        e.stopPropagation();
        this.setState({
            localFilteringEnabled: !this.state.localFilteringEnabled
        });
    };

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
