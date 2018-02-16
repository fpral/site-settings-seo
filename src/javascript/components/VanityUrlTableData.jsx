import React from 'react';
import {VanityUrlTableView} from './VanityUrlTableView'
import {ApolloProvider, graphql} from 'react-apollo';
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
            rows: _.map(data.jcr.nodesByQuery.nodes, n => ({
                path: n.path,
                uuid: n.uuid,
                displayName: n.displayName,
                defaultUrls: _.map(n.vanityUrls, u => ({
                    url: u.url,
                    language: u.language,
                    active: u.active,
                    default: u.default
                })),
                liveUrls: _.map(n.nodeInWorkspace.vanityUrls, u => ({
                    url: u.url,
                    language: u.language,
                    active: u.active,
                    default: u.default
                }))

            }))
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
        query: "select * from [" + props.type + "] where isDescendantNode('" + props.path + "')"
    };

    return {
        variables: vars,
    }
};

let query = gql`
    query NodesQuery($lang: String!, $offset: Int, $limit: Int, $query: String!) {
        jcr {
            nodesByQuery(query: $query, limit: $limit, offset: $offset, fieldFilter: {filters: [{fieldName: "vanityUrls", evaluation: NOT_EMPTY}]}) {
                pageInfo {
                    totalCount
                }
                nodes {
                    uuid
                    path
                    displayName(language: $lang)
                    vanityUrls {
                        active
                        default
                        url
                        language
                        uuid
                        path
                    }
                    nodeInWorkspace(workspace: LIVE) {
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
    }
`;

let VanityUrlTableData = graphql(query, {
    props: mapResultsToProps,
    options: mapPropsToOptions
})(VanityUrlTableView);

export {VanityUrlTableData};
