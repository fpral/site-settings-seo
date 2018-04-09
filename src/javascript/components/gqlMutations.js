import gql from "graphql-tag";
import {DefaultVanityUrlFields} from "./gqlFragments";
import {PredefinedFragments} from "@jahia/apollo-dx";

const SetPropertyMutation = gql`
    mutation setProperty($id: String!, $value: String!, $property: String!, $lang: String!) {
        jcr {
            mutateNodes(pathsOrIds: [$id]) {
                mutateProperty(name: $property) {
                    setValue(value: $value)
                }
            }
        }
        return: jcr {
            mutateNodes(pathsOrIds: [$id]) {
                node {
                    ...DefaultVanityUrlFields
                }
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

export {SetPropertyMutation, PublishMutation};