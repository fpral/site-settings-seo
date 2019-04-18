import React from 'react';
import {Query} from 'react-apollo';
import * as _ from 'lodash';
import {LanguagesQuery} from './SiteSettingsSeo.gql-queries';

class VanityUrlLanguageData extends React.Component {
    render() {
        return (
            <Query fetchPolicy="network-only" query={LanguagesQuery} variables={{path: this.props.path}}>
                { ({data}) => {
                let languages = [];
                if (data.jcr && data.jcr.nodeByPath) {
                    languages = _.sortBy(_.filter(data.jcr.nodeByPath.site.languages, language => language.activeInEdit), 'code');
                }

                return this.props.children(languages);
            }}
            </Query>
        );
    }
}

export default VanityUrlLanguageData;
