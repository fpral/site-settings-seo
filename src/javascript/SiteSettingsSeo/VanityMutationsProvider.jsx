import React, {Children, Component} from 'react';
import PropTypes from 'prop-types';
import {compose, graphql} from 'react-apollo/index';
import * as gqlMutations from './SiteSettingsSeo.gql-mutations';
import * as _ from 'lodash';
import {
    TableQuery,
    tableQueryVariables,
    VanityUrlsByPath,
    vanityUrlsByPathVariables
} from './SiteSettingsSeo.gql-queries';
import {SiteSettingsSeoConstants} from './SiteSettingsSeo';
import {AddMappingsError, DuplicateMappingError, InvalidMappingError, MoveSiteError} from './Errors';

class VanityMutationsProvider extends Component {
    constructor(props) {
        super(props);

        let {vanityMutationsContext, deleteMutation, moveMutation, updateMutation, publishMutation, addMutation} = this.props;

        vanityMutationsContext.delete = (pathsOrIds, props) => deleteMutation({
            variables: {
                pathsOrIds: pathsOrIds,
                lang: props.lang
            }, refetchQueries: [{
                query: TableQuery,
                variables: tableQueryVariables(props)
            }]
        });

        vanityMutationsContext.move = (pathsOrIds, target, props) => {
            if (!_.startsWith(target, props.path)) {
                throw new MoveSiteError('Moving vanity mapping in an other site is not allowed');
            }

            return moveMutation({
                variables: {
                    pathsOrIds: pathsOrIds,
                    target: target
                }, refetchQueries: [{
                    query: TableQuery,
                    variables: tableQueryVariables(props)
                }]
            });
        };

        vanityMutationsContext.publish = (pathsOrIds, nodeOnly) => publishMutation({
            variables: {
                pathsOrIds: pathsOrIds,
                publishSubNodes: !nodeOnly
            }
        });

        vanityMutationsContext.update = (ids, defaultMapping, active, language, url) => {
            if (url && !SiteSettingsSeoConstants.MAPPING_REG_EXP.test(url)) {
                throw new InvalidMappingError(url);
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
            });
        };

        vanityMutationsContext.add = (path, vanityUrls, props) => {
            let invalidMappings = _.filter(vanityUrls, mapping => !SiteSettingsSeoConstants.MAPPING_REG_EXP.test(mapping.url));
            let duplicateUrls = vanityUrls;
            duplicateUrls = _.pullAllBy(duplicateUrls, invalidMappings, 'url');
            duplicateUrls = _.groupBy(duplicateUrls, 'url');
            duplicateUrls = _.pickBy(duplicateUrls, x => x.length > 1);
            duplicateUrls = _.keys(duplicateUrls);

            let errors = [];
            _.each(invalidMappings, invalidMapping => errors.push(new InvalidMappingError(invalidMapping.url)));
            _.each(duplicateUrls, duplicateUrl => errors.push(new DuplicateMappingError(duplicateUrl)));

            if (errors.length > 0) {
                throw new AddMappingsError(errors);
            }

            return addMutation({
                variables: {
                    vanityUrls: vanityUrls,
                    path: path,
                    lang: props.lang
                }, refetchQueries: [{
                    query: VanityUrlsByPath,
                    variables: vanityUrlsByPathVariables(path, props)
                }]
            });
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
    return WrappedComponent => {
        let Component = class extends React.Component {
            render() {
                return (<WrappedComponent vanityMutationsContext={this.context.vanityMutationsContext} {...this.props}/>);
            }
        };

        Component.contextTypes = {
            vanityMutationsContext: PropTypes.object
        };

        return Component;
    };
}

VanityMutationsProvider.propTypes = {
    vanityMutationsContext: PropTypes.object.isRequired
};

VanityMutationsProvider.childContextTypes = {
    vanityMutationsContext: PropTypes.object.isRequired
};

export default compose(
    graphql(gqlMutations.DeleteVanity, {name: 'deleteMutation'}),
    graphql(gqlMutations.MoveMutation, {name: 'moveMutation'}),
    graphql(gqlMutations.PublishMutation, {name: 'publishMutation'}),
    graphql(gqlMutations.UpdateVanityMutation, {name: 'updateMutation'}),
    graphql(gqlMutations.AddVanityMutation, {name: 'addMutation'}),
)(VanityMutationsProvider);

export {withVanityMutationContext};
