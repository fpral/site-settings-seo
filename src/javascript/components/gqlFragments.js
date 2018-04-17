import gql from "graphql-tag";
import {PredefinedFragments} from "@jahia/apollo-dx";

const DefaultVanityUrlFields = gql`fragment DefaultVanityUrlFields on VanityUrl {
        ...NodeCacheRequiredFields
        active
        default
        url
        language
        targetNode {
            ...NodeCacheRequiredFields
        }
        publicationInfo: aggregatedPublicationInfo(language: $lang) {
            publicationStatus
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

const LiveVanityUrlFields = gql`fragment LiveVanityUrlFields on VanityUrl {
        ...NodeCacheRequiredFields
        active
        default
        url
        language
        targetNode {
            ...NodeCacheRequiredFields
        }
        editNode: nodeInWorkspace(workspace: EDIT) {
            ...NodeCacheRequiredFields
            ...on VanityUrl {
                targetNode {
                    ...NodeCacheRequiredFields
                    displayName(language: $lang)
                }
            }
        }
        parent{uuid}
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

const DefaultVanityUrls = gql`fragment DefaultVanityUrls on JCRNode {
        vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: CONTAINS_IGNORE_CASE, value: $filterText}]}) {
            ...DefaultVanityUrlFields
        }
        allVanityUrls: vanityUrls @include(if: $doFilter) {
            ...DefaultVanityUrlFields
        }
    }
    ${DefaultVanityUrlFields}
`;

const LiveVanityUrls = gql`fragment LiveVanityUrls on JCRNode {
        liveNode: nodeInWorkspace(workspace: LIVE) {
            vanityUrls(fieldFilter: {filters: [{fieldName: "url", evaluation: CONTAINS_IGNORE_CASE, value: $filterText}]}) {
                ...LiveVanityUrlFields
            }
            allVanityUrls: vanityUrls @include(if: $doFilter) {
                ...LiveVanityUrlFields
            }
        }
    }
    ${LiveVanityUrlFields}
`;

export {DefaultVanityUrlFields, LiveVanityUrlFields, DefaultVanityUrls, LiveVanityUrls};