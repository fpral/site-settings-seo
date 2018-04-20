import React from 'react';
import PropTypes from 'prop-types';
import { Component, Children } from "react";
import {compose, graphql} from "react-apollo/index";
import * as gqlMutations from "./gqlMutations";
import * as _ from "lodash";
import {TableQuery, TableQueryVariables, VanityUrlsByPath, VanityUrlsByPathVariables} from "./gqlQueries";
import {SiteSettingsSeoConstants} from "./SiteSettingsSeo";
import {InvalidMappingError, MoveSiteError} from "./Errors";

class VanityMutationsProvider extends Component {
    constructor(props) {
        super(props);

        let {vanityMutationsContext, deleteMutation, moveMutation, updateMutation, publishMutation, addMutation} = this.props;

        vanityMutationsContext.delete = (pathsOrIds, parents) => deleteMutation({
            variables: {
                pathsOrIds: pathsOrIds
            },
            update:(proxy) => {
                // Manually clean cache from parent list
                _.each(parents, (uuid) => {
                    let parentNode = proxy.data.data[proxy.config.dataIdFromObject({uuid:uuid, workspace:"EDIT"})];
                    let list = parentNode[_.find(Object.keys(parentNode), (k) => k.startsWith("vanityUrls"))];
                    _.each(pathsOrIds, (vanityUuid) => {
                        let id = proxy.config.dataIdFromObject({uuid:vanityUuid, workspace:"EDIT"});
                        _.remove(list, (v) => (v.id === id))
                    });
                });
                _.each(pathsOrIds, (id) => {
                    let liveNode = proxy.data.data[proxy.config.dataIdFromObject({uuid:id, workspace:"LIVE"})];
                    liveNode[_.find(Object.keys(liveNode), (k) => k.startsWith("nodeInWorkspace"))] = null;
                });
            }
        });

        vanityMutationsContext.move = (pathsOrIds, target, props) => {

            if (!_.startsWith(target, props.path)) {
                throw new MoveSiteError("Moving vanity mapping in an other site is not allowed")
            }

            return moveMutation({
                variables: {
                    pathsOrIds: pathsOrIds,
                    target: target
                }, refetchQueries: [{
                    query: TableQuery,
                    variables: TableQueryVariables(props)
                }]
            })
        };

        vanityMutationsContext.publish = (pathsOrIds) => publishMutation({
            variables: {
                pathsOrIds: pathsOrIds,
            }
        });

        vanityMutationsContext.update = (ids, defaultMapping, active, language, url) => {

            if (url && !SiteSettingsSeoConstants.MAPPING_REG_EXP.test(url)) {
                throw new InvalidMappingError([url])
            }

            return updateMutation({
                variables: {
                    ids: ids,
                    defaultMapping: language ? false : defaultMapping,
                    active: active,
                    language: language,
                    url: url,
                    lang: props.lang
                }
            })
        };

        vanityMutationsContext.add = (path, vanityUrls) => {

            let invalidMappings = _.filter(vanityUrls, (mapping) => !SiteSettingsSeoConstants.MAPPING_REG_EXP.test(mapping.url));

            if (invalidMappings && invalidMappings.length > 0) {
                throw new InvalidMappingError(_.map(invalidMappings, (mapping) => mapping.url))
            }

            return addMutation({
                variables: {
                    vanityUrls: vanityUrls,
                    path: path,
                    lang: props.lang
                }, refetchQueries: [{
                    query: VanityUrlsByPath,
                    variables: VanityUrlsByPathVariables(path, props.lang)
                }]
            })
        };
    }

    getChildContext() {
        return {
            vanityMutationsContext: this.props.vanityMutationsContext
        };
    }

    render() {
        return Children.only(this.props.children);
    }
}

function withVanityMutationContext() {
    return (WrappedComponent) => {
        let Component = class extends React.Component {
            render() {
                return (<WrappedComponent vanityMutationsContext={this.context.vanityMutationsContext} {...this.props} />)
            }
        };

        Component.contextTypes = {
            vanityMutationsContext: PropTypes.object
        };

        return Component
    }
}

VanityMutationsProvider.propTypes = {
    vanityMutationsContext: PropTypes.object.isRequired
};

VanityMutationsProvider.childContextTypes = {
    vanityMutationsContext: PropTypes.object.isRequired
};

VanityMutationsProvider = compose(
    graphql(gqlMutations.DeleteVanity, {name: 'deleteMutation'}),
    graphql(gqlMutations.MoveMutation, {name: 'moveMutation'}),
    graphql(gqlMutations.PublishMutation, {name: 'publishMutation'}),
    graphql(gqlMutations.UpdateVanityMutation, {name: 'updateMutation'}),
    graphql(gqlMutations.AddVanityMutation, {name: 'addMutation'}),
)(VanityMutationsProvider);

export {VanityMutationsProvider, withVanityMutationContext};