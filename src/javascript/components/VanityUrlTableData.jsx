import React from 'react';
import {Query} from 'react-apollo';
import {withNotifications, ProgressOverlay} from '@jahia/react-material';
import * as _ from 'lodash';
import {TableQuery, TableQueryVariables} from './gqlQueries';
import {translate} from 'react-i18next';

function gqlContentNodeToVanityUrlPairs(gqlContentNode, vanityUrlsFieldName) {
    let defaultUrls = _.keyBy(_.map(gqlContentNode[vanityUrlsFieldName], vanityUrlNode => ({uuid: vanityUrlNode.uuid, default: vanityUrlNode})), 'uuid');
    let liveUrls = gqlContentNode.liveNode ? _.keyBy(_.map(gqlContentNode.liveNode[vanityUrlsFieldName], vanityUrlNode => ({uuid: vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid') : {};
    let urlPairs = _.merge(defaultUrls, liveUrls);
    urlPairs = _.sortBy(urlPairs, urlPair => (urlPair.default ? urlPair.default.language : urlPair.live.language));
    return _.values(urlPairs);
}

class VanityUrlTableData extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {t, classes, filterText, totalCount, pageSize, poll, notificationContext} = this.props;
        return (
            <Query fetchPolicy="network-only" query={TableQuery} variables={TableQueryVariables(this.props)} pollInterval={poll}>
                { ({loading, error, data}) => {
                if (error) {
                    console.log('Error when fetching data: ' + error);
                    notificationContext.notify(t('label.errors.loadingVanityUrl'), ['closeButton', 'noAutomaticClose']);
                }

                let totalCount = 0;
                let numberOfPages = 0;
                let rows = [];
                if (data.jcr && data.jcr.nodesByQuery) {
                    totalCount = data.jcr.nodesByQuery.pageInfo.totalCount;
                    numberOfPages = (data.jcr.nodesByQuery.pageInfo.totalCount / pageSize);

                    rows = _.map(data.jcr.nodesByQuery.nodes, contentNode => {
                        let urlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'vanityUrls');
                        let allUrlPairs;
                        if (filterText) {
                            allUrlPairs = gqlContentNodeToVanityUrlPairs(contentNode, 'allVanityUrls');
                            urlPairs = _.filter(allUrlPairs, urlPair => _.find(urlPairs, url => url.uuid === urlPair.uuid));
                        }

                        return {
                            path: contentNode.path,
                            uuid: contentNode.uuid,
                            displayName: contentNode.displayName,
                            urls: urlPairs,
                            allUrls: allUrlPairs
                        };
                    });
                }

                return (
                    <div>
                        {loading && <ProgressOverlay/>}
                        {this.props.children(rows, totalCount, numberOfPages)}
                    </div>
);
            }}
            </Query>
        );
    }
}

VanityUrlTableData = _.flowRight(
    withNotifications(),
    translate()
)(VanityUrlTableData);

export {VanityUrlTableData};
