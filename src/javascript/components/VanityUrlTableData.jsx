import React from 'react';
import {VanityUrlTableView} from './VanityUrlTableView'
import {PredefinedFragments} from "@jahia/apollo-dx";
import {Query} from 'react-apollo';
import {CircularProgress} from 'material-ui/Progress';
import gql from "graphql-tag";
import * as _ from "lodash";
import ErrorSnackBar from "./ErrorSnackBar";
import {TableQuery, TableQueryVariables} from "./gqlQueries";

function gqlContentNodeToVanityUrlPairs(gqlContentNode, vanityUrlsFieldName) {
    let defaultUrls = _.keyBy(_.map(gqlContentNode[vanityUrlsFieldName], vanityUrlNode => ({uuid: vanityUrlNode.uuid, default: vanityUrlNode})), 'uuid');
    let liveUrls = gqlContentNode.liveNode ? _.keyBy(_.map(gqlContentNode.liveNode[vanityUrlsFieldName], vanityUrlNode => ({uuid: vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid') : {};
    let urlPairs = _.merge(defaultUrls, liveUrls);
    urlPairs = _.sortBy(urlPairs, urlPair => (urlPair.default ? urlPair.default.language : urlPair.live.language));
    return _.values(urlPairs);
}

let VanityUrlTableData = (props) => {

    // let fetchPolicy = props.filterText ? 'no-cache' : 'cache-first';
    let fetchPolicy = 'network-only';

    return <Query fetchPolicy={fetchPolicy} query={TableQuery} variables={TableQueryVariables(props)}>
        { ({loading, error, data}) => {

            if (error) {
                console.log("Error when fetching data: " + error);
                return <ErrorSnackBar error={props.t('label.errors.loadingVanityUrl')}/>
            }

            if (loading) {
                return <CircularProgress/>
            }

            let totalCount = data.jcr.nodesByQuery.pageInfo.totalCount;
            let numberOfPages = (data.jcr.nodesByQuery.pageInfo.totalCount / props.pageSize);

            let rows = _.map(data.jcr.nodesByQuery.nodes, contentNode => {

                let urlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'vanityUrls');
                let allUrlPairs;
                if (props.filterText) {
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

            return <VanityUrlTableView {...props} totalCount={totalCount} numberOfPages={numberOfPages} rows={rows} languages={props.languages}/>
        }}
    </Query>
};

export {VanityUrlTableData};
