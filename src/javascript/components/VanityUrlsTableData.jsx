import React from 'react';
import {VanityUrlsTableView} from './VanityUrlsTableView'
import {ApolloProvider, graphql} from 'react-apollo';
import gql from "graphql-tag";
import * as _ from "lodash";
import {client, replaceFragmentsInDocument} from "@jahia/apollo-dx";

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
                    url: u.url.value,
                    language: u.language.value,
                    active: u.active.value,
                    default: u.default.value
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
        limit: props.pageSize
    };

    return {
        variables: vars,
    }
};

let query = gql`
    query NodesQuery($lang:String!, $offset: Int, $limit:Int) {
        jcr {
            vanityUrls:nodesByQuery(query :"select * from [jnt:vanityUrls]", limit: $limit, offset: $offset) {
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
                            uuid
                            path
                            url:property(name:"j:url") {
                                value
                            } 
                            language:property(name:"jcr:language") {
                                value
                            }
                            active:property(name:"j:active") {
                                value
                            }
                            default:property(name:"j:default") {
                                value
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
