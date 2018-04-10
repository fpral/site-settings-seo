import gql from "graphql-tag";
import {DefaultVanityUrlFields} from "./gqlFragments";
import {PredefinedFragments} from "@jahia/apollo-dx";

const UpdateVanityMutation = gql`
    mutation updateVanity($ids: [String!]!, $defaultMapping: Boolean, $active: Boolean, $url: String, $language: String, $lang: String!) {
        jcr {
            mutateVanityUrls(pathsOrIds: $ids) {
              update(defaultMapping:$defaultMapping,active:$active,url:$url, language:$language)
            }
            modifiedNodes {
              ...DefaultVanityUrlFields
            }
        }
    }
    ${DefaultVanityUrlFields}
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

const PublishMutation = gql`
    mutation mutateNodes($pathsOrIds: [String!]!) {
        jcr {
            mutateNodes(pathsOrIds: $pathsOrIds) {
                publish
            }
        }
    }
`;

const DeleteVanity = gql`
    mutation deleteVanityUrls($pathsOrIds: [String!]!) {
        jcr{
            mutateNodes(pathsOrIds: $pathsOrIds){
                delete
            }
        }
    }         
`;

export {UpdateVanityMutation, PublishMutation, DeleteVanity};