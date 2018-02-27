import React from 'react';
import {VanityUrlTableView} from './VanityUrlTableView'
import {graphql} from 'react-apollo';
import gql from "graphql-tag";
import * as _ from "lodash";
import {replaceFragmentsInDocument} from "@jahia/apollo-dx";

let mapResultsToProps = ({data, ownProps}) => {

    let jcr = data.jcr;

    if (jcr) {

        return {

            ...ownProps,
            totalCount: data.jcr.nodesByQuery.pageInfo.totalCount,
            numberOfPages: (data.jcr.nodesByQuery.pageInfo.totalCount / ownProps.pageSize),

            rows: _.map(data.jcr.nodesByQuery.nodes, contentNode => {

                let defaultUrls = _.keyBy(_.map(contentNode.vanityUrls, vanityUrlNode => ({uuid: vanityUrlNode.uuid, default: vanityUrlNode})), 'uuid');
                let liveUrls = contentNode.liveNode ? _.keyBy(_.map(contentNode.liveNode.vanityUrls, vanityUrlNode => ({uuid:vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid') : {};
                let urlPairs = _.merge(defaultUrls, liveUrls);
                urlPairs = _.sortBy(urlPairs, urlPair => (urlPair.default ? urlPair.default.language : urlPair.live.language));

                return {
                    path: contentNode.path,
                    uuid: contentNode.uuid,
                    displayName: contentNode.displayName,
                    urls: _.values(urlPairs)
                }
            })
        }
    }

    return {
        ...ownProps,
        totalCount: 0,
        numberOfPages: 0,
        rows: []
    }
};

let mapPropsToOptions = (props) => {

    // Normally we want to perform all content filtering on the server side, either by non-empty collection of associated vanity URLs and filter text (if any).
    // However, because current GraphQL API does not allow for fetching content that has vanity URLs in LIVE but does not have any in DEFAULT, we fetch any
    // content that has ever had any vanity URLs in DEFAULT (otherwise, it could not have any vanity URLs in LIVE). The jmix:vanityUrlMapped mixin is temporarily
    // serving this purpose, because it is (mistakenly) not removed when all vanity URLs of a content are removed.
    //
    // At the same time, we still perform all filtering on the server side in case any filter text is entered. This won't fetch any content that has vanity URLs
    // in LIVE, but does not have any in DEFAULT, as explained above, however.
    //
    // BACKLOG-7698 is to resolve the issue with fetching content that has vanity URLs in LIVE only, but not in DEFAULT.
    let vars = {
        lang: contextJsParameters.uilang,
        offset: (props.currentPage * props.pageSize),
        limit: props.pageSize,
        query: "select * from [jmix:vanityUrlMapped] as content where isDescendantNode('" + props.path + "') order by [j:fullpath]" ,
        filterText: props.filterText,
        queryFilter: {filters: props.filterText ? [{fieldName: "vanityUrls", evaluation: "NOT_EMPTY"}] : []}
    };

    return {
        variables: vars,
        fetchPolicy: props.filterText ? 'network-only' : 'cache-first'
    }
};

let query = gql`
    query NodesQuery($lang: String!, $offset: Int, $limit: Int, $query: String!, $filterText: String, $queryFilter: InputFieldFiltersInput) {
        jcr {
            nodesByQuery(query: $query, limit: $limit, offset: $offset, fieldFilter: $queryFilter) {
                pageInfo {
                    totalCount
                }
                nodes {
                    uuid
                    path
                    displayName(language: $lang)
                    vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: CONTAINS_IGNORE_CASE, value: $filterText}]}) {
                        active
                        default
                        url
                        language
                        uuid
                        path
                    }
                    liveNode: nodeInWorkspace(workspace: LIVE) {
                        vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: CONTAINS_IGNORE_CASE, value: $filterText}]}) {
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
    }
`;

let VanityUrlTableData = graphql(query, {
    props: mapResultsToProps,
    options: mapPropsToOptions
})(VanityUrlTableView);

export {VanityUrlTableData};
