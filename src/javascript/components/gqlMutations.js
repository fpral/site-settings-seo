import gql from "graphql-tag";
import {DefaultVanityUrlFields, DefaultVanityUrls} from "./gqlFragments";

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

const MoveMutation = gql`
    mutation mutateNodes($pathsOrIds: [String!]!, $target: String!) {
        jcr {
            mutateVanityUrls(pathsOrIds: $pathsOrIds) {
                move(target: $target)
            }
        }
    }
`;

const AddVanityMutation = gql`
    mutation addVanity($path: String!, $defaultMapping: Boolean!, $active: Boolean, $url: String!, $language: String!, $lang: String!) {
        jcr {
            mutateNode(pathOrId: $path) {
                addVanityUrl(defaultMapping:$defaultMapping,active:$active,url:$url, language:$language)
            }
            modifiedNodes {
                ...DefaultVanityUrlFields
            }
        }
    }
    ${DefaultVanityUrlFields}
`;
export {MoveMutation, UpdateVanityMutation, PublishMutation, DeleteVanity, AddVanityMutation};