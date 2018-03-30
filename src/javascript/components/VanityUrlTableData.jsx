import React from 'react';
import {VanityUrlTableView} from './VanityUrlTableView'
import {graphql, Query} from 'react-apollo';
import gql from "graphql-tag";
import * as _ from "lodash";
import {replaceFragmentsInDocument} from "@jahia/apollo-dx";

function gqlContentNodeToVanityUrlPairs(gqlContentNode, vanityUrlsFieldName) {
    let defaultUrls = _.keyBy(_.map(gqlContentNode[vanityUrlsFieldName], vanityUrlNode => ({uuid: vanityUrlNode.uuid, default: vanityUrlNode})), 'uuid');
    let liveUrls = gqlContentNode.liveNode ? _.keyBy(_.map(gqlContentNode.liveNode[vanityUrlsFieldName], vanityUrlNode => ({uuid:vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid') : {};
    let urlPairs = _.merge(defaultUrls, liveUrls);
    urlPairs = _.sortBy(urlPairs, urlPair => (urlPair.default ? urlPair.default.language : urlPair.live.language));
    return _.values(urlPairs);
}

let mapResultsToProps = (res, ownProps) => {

    let jcr = res.data.jcr;

    if (jcr) {

        return {
            totalCount: jcr.nodesByQuery.pageInfo.totalCount,
            numberOfPages: (jcr.nodesByQuery.pageInfo.totalCount / ownProps.pageSize),

            rows: _.map(jcr.nodesByQuery.nodes, contentNode => {

                let urlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'vanityUrls');
                let allUrlPairs;
                if (ownProps.filterText) {
                    allUrlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'allVanityUrls');
                    urlPairs = _.filter(allUrlPairs, (p) => _.find(urlPairs, (url) => url.uuid === p.uuid));
                }

                return {
                    path: contentNode.path,
                    uuid: contentNode.uuid,
                    displayName: contentNode.displayName,
                    urls: urlPairs,
                    allUrls: allUrlPairs
                }
            })
        }
    }

    return {
        totalCount: 0,
        numberOfPages: 0,
        rows: []
    }
};

let query = gql`
    query NodesQuery($lang: String!, $offset: Int, $limit: Int, $query: String!, $filterText: String, $doFilter: Boolean!, $queryFilter: InputFieldFiltersInput) {
        jcr {
            nodesByQuery(query: $query, limit: $limit, offset: $offset, fieldFilter: $queryFilter) {
                pageInfo {
                    totalCount
                }
                nodes {
                    uuid
                    path
                    displayName(language: $lang)
                    ...NodeFields
                    liveNode: nodeInWorkspace(workspace: LIVE) {
                        ...NodeFields
                    }
                }
            }
        }
    }
    fragment NodeFields on JCRNode {
        vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: CONTAINS_IGNORE_CASE, value: $filterText}]}) {
            ... VanityUrlFields
        }
        allVanityUrls: vanityUrls @include(if: $doFilter) {
            ... VanityUrlFields
        }
    }
    fragment VanityUrlFields on VanityUrl {
        active
        default
        url
        language
        uuid
        path
    }
`;

let VanityUrlTableData = (props) => {
    let variables = {
        lang: contextJsParameters.uilang,
        offset: (props.currentPage * props.pageSize),
        limit: props.pageSize,
        query: "select * from [jmix:vanityUrlMapped] as content where isDescendantNode('" + props.path + "') order by [j:fullpath]" ,
        filterText: props.filterText,
        doFilter: !!props.filterText,
        queryFilter: {multi: "ANY", filters: [{fieldName: "vanityUrls", evaluation: "NOT_EMPTY"}, {fieldName: "liveNode.vanityUrls", evaluation: "NOT_EMPTY"}]}
    };

    // let fetchPolicy = props.filterText ? 'no-cache' : 'cache-first';
    let fetchPolicy = 'network-only';

    return <Query fetchPolicy={fetchPolicy} query={query} variables={variables} >
        { (res) => <VanityUrlTableView {...mapResultsToProps(res, props)} {...props} /> }
    </Query>
}

export {VanityUrlTableData};
