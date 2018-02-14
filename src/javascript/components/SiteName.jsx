import React from 'react';
import {graphql} from 'react-apollo';
import gql from "graphql-tag";
import {replaceFragmentsInDocument} from "@jahia/apollo-dx";
import PropTypes from 'prop-types';

let mapResultsToProps = ({data, ownProps}) => {
    let jcr = data.jcr;

    if (jcr) {
        return {
            ...ownProps,
            siteName: data.jcr.site.site.displayName
        }
    }

    return {
        ...ownProps,
        siteName: ""
    }
};

let mapPropsToOptions = (props) => {
    let vars = {
        sitePath: props.path
    };

    return {
        variables: vars,
    }
};

let query = gql`
    query NodesQuery($sitePath:String!) {
        jcr {
            site:nodeByPath(path:$sitePath) {
                site {
                    displayName
                }
            }
        }
    }`;

let SiteNameView = function (props) {
    return (
        props.siteName
    );
}

let SiteName = graphql(query, {
    props: mapResultsToProps,
    options: mapPropsToOptions
})(SiteNameView);

SiteName.propTypes = {
    path: PropTypes.string.isRequired
};

export {SiteName}