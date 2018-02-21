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
                let liveUrls = _.keyBy(_.map(contentNode.nodeInWorkspace.vanityUrls, vanityUrlNode => ({uuid:vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid');
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
    let vars = {
        lang: contextJsParameters.uilang,
        offset: (props.currentPage * props.pageSize),
        limit: props.pageSize,
        query: "select * from [" + props.type + "] as content where isDescendantNode('" + props.path + "')",
        filteredText: ".*(?i)" + props.filteredText + "(?-i).*",
        vanityFilter: {filters: props.filteredText ? [{fieldName: "vanityUrls", evaluation: "NOT_EMPTY"}] : []}
    };

    return {
        variables: vars,
    }
};

let query = gql`
    query NodesQuery($lang: String!, $offset: Int, $limit: Int, $query: String!, $filteredText: String, $vanityFilter: InputFieldFiltersInput) {
        jcr {
            nodesByQuery(query: $query, limit: $limit, offset: $offset, fieldFilter: $vanityFilter) {
                pageInfo {
                    totalCount
                }
                nodes {
                    uuid
                    path
                    displayName(language: $lang)
                    vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: MATCHES, value: $filteredText}]}) {
                        active
                        default
                        url
                        language
                        uuid
                        path
                    }
                    nodeInWorkspace(workspace: LIVE) {
                        vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: MATCHES, value: $filteredText}]}) {
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
