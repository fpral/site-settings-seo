import React from 'react';
import {VanityUrlTableView} from './VanityUrlTableView'
import {PredefinedFragments} from "@jahia/apollo-dx";
import {Query} from 'react-apollo';
import { CircularProgress } from 'material-ui/Progress';
import gql from "graphql-tag";
import * as _ from "lodash";
import {LiveVanityUrlFields, DefaultVanityUrlFields} from "./fragments";

function gqlContentNodeToVanityUrlPairs(gqlContentNode, vanityUrlsFieldName) {
    let defaultUrls = _.keyBy(_.map(gqlContentNode[vanityUrlsFieldName], vanityUrlNode => ({uuid: vanityUrlNode.uuid, default: vanityUrlNode})), 'uuid');
    let liveUrls = gqlContentNode.liveNode ? _.keyBy(_.map(gqlContentNode.liveNode[vanityUrlsFieldName], vanityUrlNode => ({uuid:vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid') : {};
    let urlPairs = _.merge(defaultUrls, liveUrls);
    urlPairs = _.sortBy(urlPairs, urlPair => (urlPair.default ? urlPair.default.language : urlPair.live.language));
    return _.values(urlPairs);
}

let query = gql`
    query NodesQuery($lang: String!, $offset: Int, $limit: Int, $query: String!, $filterText: String, $doFilter: Boolean!, $queryFilter: InputFieldFiltersInput) {
        jcr {
            nodesByQuery(query: $query, limit: $limit, offset: $offset, fieldFilter: $queryFilter) {
                pageInfo {
                    totalCount
                }
                nodes {
                    ...NodeCacheRequiredFields
                    displayName(language: $lang)
                    vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: CONTAINS_IGNORE_CASE, value: $filterText}]}) {
                        ...DefaultVanityUrlFields
                    }
                    allVanityUrls: vanityUrls @include(if: $doFilter) {
                        ...DefaultVanityUrlFields
                    }
                    liveNode: nodeInWorkspace(workspace: LIVE) {
                        vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: CONTAINS_IGNORE_CASE, value: $filterText}]}) {
                            ...LiveVanityUrlFields
                        }
                        allVanityUrls: vanityUrls @include(if: $doFilter) {
                            ...LiveVanityUrlFields
                        }
                    }
                    site {
                        languages {
                            language
                            displayName
                        }
                    }
                }
            }
        }
    }
    ${DefaultVanityUrlFields}
    ${LiveVanityUrlFields}
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

let VanityUrlTableData = (props) => {
    let variables = {
        lang: contextJsParameters.uilang,
        offset: (props.currentPage * props.pageSize),
        limit: props.pageSize,
        query: "select * from [jmix:vanityUrlMapped] as content where isDescendantNode('" + props.path + "') order by [j:fullpath]",
        filterText: props.filterText,
        doFilter: !!props.filterText,
        queryFilter: {multi: "ANY", filters: [{fieldName: "vanityUrls", evaluation: "NOT_EMPTY"}, {fieldName: "liveNode.vanityUrls", evaluation: "NOT_EMPTY"}]}
    };

    // let fetchPolicy = props.filterText ? 'no-cache' : 'cache-first';
    let fetchPolicy = 'network-only';

    return <Query fetchPolicy={fetchPolicy} query={query} variables={variables}>
        { ({loading, error, data}) => {
            let totalCount = 0;
            let numberOfPages = 0;
            let rows = [];

            if (error) {
                console.log("Error when fetching data : " + error);
            }

            if (!loading && !error) {
                totalCount = data.jcr.nodesByQuery.pageInfo.totalCount;
                numberOfPages = (data.jcr.nodesByQuery.pageInfo.totalCount / props.pageSize);

                rows = _.map(data.jcr.nodesByQuery.nodes, contentNode => {

                    let urlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'vanityUrls');
                    let allUrlPairs;
                    if (props.filterText) {
                        allUrlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'allVanityUrls');
                        urlPairs = _.filter(allUrlPairs, (p) => _.find(urlPairs, (url) => url.uuid === p.uuid));
                    }

                    return {
                        path: contentNode.path,
                        uuid: contentNode.uuid,
                        displayName: contentNode.displayName,
                        languages: contentNode.site.languages,
                        urls: urlPairs,
                        allUrls: allUrlPairs
                    }
                });

                return <VanityUrlTableView {...props} totalCount={totalCount} numberOfPages={numberOfPages} rows={rows}/>
            }

            return <CircularProgress/>
        }}
    </Query>
}

export {VanityUrlTableData};
