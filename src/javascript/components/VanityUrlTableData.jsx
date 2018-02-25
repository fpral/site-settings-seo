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
                let liveUrls = _.keyBy(_.map(contentNode.liveNode.vanityUrls, vanityUrlNode => ({uuid:vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid');
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
        query: "select * from [jmix:vanityUrlMapped] as content where isDescendantNode('" + props.path + "') order by [j:fullpath]" ,
        filterText: props.filterText,
        queryFilter: {filters: props.filterText ? [{fieldName: "vanityUrls", evaluation: "NOT_EMPTY"}] : []} // todo: this test is necessary until BACKLOG-7698 is fixed
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
