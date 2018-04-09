import gql from "graphql-tag";

const DefaultVanityUrlFields = gql`fragment DefaultVanityUrlFields on VanityUrl {
        ...NodeCacheRequiredFields
        active
        default
        url
        language
        publicationInfo: aggregatedPublicationInfo(language: $lang) {
            publicationStatus
        }
    }
`;

const LiveVanityUrlFields = gql`fragment LiveVanityUrlFields on VanityUrl {
        ...NodeCacheRequiredFields
        active
        default
        url
        language
        editNode: nodeInWorkspace(workspace: EDIT) {
            ...NodeCacheRequiredFields
            ...on VanityUrl {
                targetNode {
                    ...NodeCacheRequiredFields
                    displayName(language: $lang)
                }
            }
        }
    }
`;

export {DefaultVanityUrlFields, LiveVanityUrlFields};