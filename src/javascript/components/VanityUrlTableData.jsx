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
            rows: _.map(data.jcr.nodesByQuery.nodes, n => {
                let defaultUrls = _.keyBy(_.map(n.vanityUrls, o=> ({uuid:o.uuid, default:o})), 'uuid');
                let liveUrls = _.keyBy(_.map(n.nodeInWorkspace.vanityUrls, o=> ({uuid:o.uuid, live:o})), 'uuid');
                let urls = _.merge(defaultUrls, liveUrls);

                return {
                    path: n.path,
                    uuid: n.uuid,
                    displayName: n.displayName,
                    urls: _.values(urls)
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
    let properties = ["jcr:title", "name"];
    let filteredText = "";
    if (props.filteredText) {
        properties.forEach(
            function(property, index) {
                filteredText += (index > 0 ? " or " : " and ") + " LOWER(content.['" + property + "']) LIKE '%" + props.filteredText.toLowerCase() + "%'"
            });
    }

    let vars = {
        lang: contextJsParameters.uilang,
        offset: (props.currentPage * props.pageSize),
        limit: props.pageSize,
        query: "select * from [" + props.type + "] as content where isDescendantNode('" + props.path + "')" + (filteredText ? filteredText : "")
    };

    return {
        variables: vars,
    }
};

let query = gql`
    query NodesQuery($lang: String!, $offset: Int, $limit: Int, $query: String!) {
        jcr {
            nodesByQuery(query: $query, limit: $limit, offset: $offset) {
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
