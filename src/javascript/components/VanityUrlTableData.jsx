import React from 'react';
import {Query} from 'react-apollo';
import {CircularProgress} from 'material-ui/Progress';
import * as _ from "lodash";
import ErrorSnackBar from "./ErrorSnackBar";
import {TableQuery, TableQueryVariables} from "./gqlQueries";
import {withStyles} from "material-ui";
import {translate} from "react-i18next";

const styles = (theme) => ({
    loadingOverlay : {
        position: "absolute",
        left: "50%",
        top: "50%",
        display: "block",
        transform: "translate( -50%, -50% )"
    }
});

function gqlContentNodeToVanityUrlPairs(gqlContentNode, vanityUrlsFieldName) {
    let defaultUrls = _.keyBy(_.map(gqlContentNode[vanityUrlsFieldName], vanityUrlNode => ({uuid: vanityUrlNode.uuid, default: vanityUrlNode})), 'uuid');
    let liveUrls = gqlContentNode.liveNode ? _.keyBy(_.map(gqlContentNode.liveNode[vanityUrlsFieldName], vanityUrlNode => ({uuid: vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid') : {};
    let urlPairs = _.merge(defaultUrls, liveUrls);
    urlPairs = _.sortBy(urlPairs, urlPair => (urlPair.default ? urlPair.default.language : urlPair.live.language));
    return _.values(urlPairs);
}
class VanityUrlTableData extends React.Component {

    constructor(props) {
        super(props);
        this.renderChildren = this.renderChildren.bind(this)
    }

    renderChildren(totalCount, numberOfPages, rows) {
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                totalCount: totalCount,
                numberOfPages: numberOfPages,
                rows: rows
            })
        })
    }

    render() {
        let { t, classes } = this.props;
        return <Query fetchPolicy={'network-only'} query={TableQuery} variables={TableQueryVariables(this.props)} pollInterval={this.props.poll}>
            { ({loading, error, data}) => {

                if (error) {
                    console.log("Error when fetching data: " + error);
                    return <ErrorSnackBar error={t('label.errors.loadingVanityUrl')}/>
                }

                if (loading) {
                    return <div className={classes.loadingOverlay}><CircularProgress/></div>
                }

                let totalCount = 0;
                let numberOfPages = 0;
                let rows = [];
                if (data.jcr && data.jcr.nodesByQuery) {
                    totalCount = data.jcr.nodesByQuery.pageInfo.totalCount;
                    numberOfPages = (data.jcr.nodesByQuery.pageInfo.totalCount / this.props.pageSize);

                    rows = _.map(data.jcr.nodesByQuery.nodes, contentNode => {

                        let result = {
                            path: contentNode.path,
                            uuid: contentNode.uuid,
                            displayName: contentNode.displayName
                        };

                        let urlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'vanityUrls');
                        _.each(urlPairs, (p)=> {p.content = result});

                        let allUrlPairs;
                        if (this.props.filterText) {
                            allUrlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'allVanityUrls');
                            _.each(allUrlPairs, (p) => {p.content = result});

                            urlPairs = _.filter(allUrlPairs, (urlPair) => _.find(urlPairs, (url) => url.uuid === urlPair.uuid));
                        }

                        result.urls = urlPairs;
                        result.allUrls = allUrlPairs;

                        return result;
                    });
                }

                return <div>{this.renderChildren(totalCount, numberOfPages, rows)}</div>
            }}
        </Query>
    }
}

VanityUrlTableData = withStyles(styles)(translate('site-settings-seo')(VanityUrlTableData));

export {VanityUrlTableData};
