import * as _ from "lodash";

const GQL_VANITY_URL_FIELDS = 'active default url language uuid path';

function gqlContentNodeToVanityUrlPairs(gqlContentNode) {
    let defaultUrls = _.keyBy(_.map(gqlContentNode.vanityUrls, vanityUrlNode => ({uuid: vanityUrlNode.uuid, default: vanityUrlNode})), 'uuid');
    let liveUrls = gqlContentNode.liveNode ? _.keyBy(_.map(gqlContentNode.liveNode.vanityUrls, vanityUrlNode => ({uuid:vanityUrlNode.uuid, live: vanityUrlNode})), 'uuid') : {};
    let urlPairs = _.merge(defaultUrls, liveUrls);
    urlPairs = _.sortBy(urlPairs, urlPair => (urlPair.default ? urlPair.default.language : urlPair.live.language));
    return _.values(urlPairs);
}

export {
    GQL_VANITY_URL_FIELDS,
    gqlContentNodeToVanityUrlPairs
};