import React from 'react';
import {Query} from 'react-apollo';
import {CircularProgress, withStyles} from '@material-ui/core';
import * as _ from "lodash";
import ErrorSnackBar from "./ErrorSnackBar";
import {TableQuery, TableQueryVariables} from "./gqlQueries";
import {translate} from "react-i18next";

const styles = (theme) => ({
    loadingOverlay : {
        position: "fixed",
        left: "50%",
        top: "50%",
        display: "block",
        transform: "translate( -50%, -50% )",
        zIndex:999
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
    }

    render() {
        let { t, classes, filterText, totalCount, pageSize, poll} = this.props;
        return <Query fetchPolicy={'network-only'} query={TableQuery} variables={TableQueryVariables(this.props)} pollInterval={poll}>
            { ({loading, error, data}) => {

                if (error) {
                    console.log("Error when fetching data: " + error);
                }

                let totalCount = 0;
                let numberOfPages = 0;
                let rows = [];
                if (data.jcr && data.jcr.nodesByQuery) {
                    totalCount = data.jcr.nodesByQuery.pageInfo.totalCount;
                    numberOfPages = (data.jcr.nodesByQuery.pageInfo.totalCount / pageSize);

                    rows = _.map(data.jcr.nodesByQuery.nodes, contentNode => {
                        let urlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'vanityUrls');
                        let allUrlPairs;
                        if (filterText) {
                            allUrlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'allVanityUrls');
                            urlPairs = _.filter(allUrlPairs, (urlPair) => _.find(urlPairs, (url) => url.uuid === urlPair.uuid));
                        }

                        return {
                            path: contentNode.path,
                            uuid: contentNode.uuid,
                            displayName: contentNode.displayName,
                            urls: urlPairs,
                            allUrls: allUrlPairs
                        }
                    });
                }

                return <div>
                    {error && <ErrorSnackBar error={t('label.errors.loadingVanityUrl')}/>}
                    {loading && <div className={classes.loadingOverlay}><CircularProgress/></div>}
                    {this.props.children(rows, totalCount, numberOfPages)}
                </div>;

            }}
        </Query>
    }
}

VanityUrlTableData = withStyles(styles)(translate()(VanityUrlTableData));

export {VanityUrlTableData};
