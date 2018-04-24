import React from 'react';
import {Query} from 'react-apollo';
import * as _ from "lodash";
import {CircularProgress} from 'material-ui/Progress';
import ErrorSnackBar from "./ErrorSnackBar";
import {LanguagesQuery} from "./gqlQueries";
import {withStyles} from "material-ui";
import {translate} from "react-i18next";

class VanityUrlLanguageData extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <Query fetchPolicy={'network-only'} query={LanguagesQuery} variables={{path: this.props.path}}>
            { ({loading, error, data}) => {
                let languages = [];
                if (data.jcr && data.jcr.nodeByPath) {
                    languages = _.sortBy(data.jcr.nodeByPath.site.languages, 'code');
                }

                return this.props.children(languages);
            }}
        </Query>
    }
}

export {VanityUrlLanguageData};
