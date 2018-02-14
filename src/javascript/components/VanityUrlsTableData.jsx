import React from 'react';
import {VanityUrlsTableView} from './VanityUrlsTableView'
import {ApolloProvider, graphql} from 'react-apollo';
import gql from "graphql-tag";
import * as _ from "lodash";
import {replaceFragmentsInDocument} from "@jahia/apollo-dx";

let mapResultsToProps = ({data, ownProps}) => {
    let jcr = data.jcr;

    if (jcr) {
        return {
            ...ownProps,
            totalCount : data.jcr.vanityUrls.pageInfo.totalCount,
            numberOfPages: (data.jcr.vanityUrls.pageInfo.totalCount / ownProps.pageSize),
            rows: _.map(data.jcr.vanityUrls.nodes, n => ({
                path:n.parent.path,
                uuid:n.parent.uuid,
                displayName:n.parent.displayName,
                urls: _.map(n.children.nodes, u => ({
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
        totalCount:0,
        numberOfPages: 0,
        rows:[]
    }
};

let mapPropsToOptions = (props) => {
    let vars = {
        lang:contextJsParameters.uilang,
        offset: (props.currentPage * props.pageSize),
        limit: props.pageSize,
        query: "select * from [jnt:vanityUrls] where isDescendantNode('" + props.path + "')"
    };

    return {
        variables: vars,
    }
};

let query = gql`
    query NodesQuery($lang:String!, $offset: Int, $limit:Int, $query:String!) {
        jcr {
            vanityUrls:nodesByQuery(query : $query, limit: $limit, offset: $offset) {
                pageInfo {
                    totalCount
                }
                nodes {
                    uuid
                    path
                    parent {
                        displayName(language:$lang)
                        uuid
                        path
                        
                    }
                    children {
                        nodes {
                            ... on VanityUrl {
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
    }`;

let VanityUrlsTableData = graphql(query, {
    props: mapResultsToProps,
    options: mapPropsToOptions
})(VanityUrlsTableView);

export {VanityUrlsTableData};
