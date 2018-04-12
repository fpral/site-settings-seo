import {DefaultVanityUrls, LiveVanityUrls} from "./gqlFragments";
import gql from "graphql-tag";

const TableQuery = gql`
    query NodesQuery($lang: String!, $offset: Int, $limit: Int, $query: String!, $filterText: String, $doFilter: Boolean!, $queryFilter: InputFieldFiltersInput, $path: String!) {
        jcr {
            nodesByQuery(query: $query, limit: $limit, offset: $offset, fieldFilter: $queryFilter) {
                pageInfo {
                    totalCount
                }
                nodes {
                    ...NodeCacheRequiredFields
                    displayName(language: $lang)
                    ...DefaultVanityUrls
                    ...LiveVanityUrls
                }
            }
            nodeByPath(path: $path) {
                site {
                    languages {
                        code: language
                        name: displayName
                    }
                }
            }
        }
    }
    ${DefaultVanityUrls}
    ${LiveVanityUrls}
`;

const TableQueryVariables = (props) => ({
    lang: contextJsParameters.uilang,
        offset: (props.currentPage * props.pageSize),
        limit: props.pageSize,
        query: "select * from [jmix:vanityUrlMapped] as content where isDescendantNode('" + props.path + "') order by [j:fullpath]",
        filterText: props.filterText,
        doFilter: !!props.filterText,
        queryFilter: {multi: "ANY", filters: [{fieldName: "vanityUrls", evaluation: "NOT_EMPTY"}, {fieldName: "liveNode.vanityUrls", evaluation: "NOT_EMPTY"}]},
    path: props.path
});

export {TableQuery, TableQueryVariables};