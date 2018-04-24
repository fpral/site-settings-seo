import React from 'react';
import {Query} from 'react-apollo';
import * as _ from "lodash";
import {CircularProgress} from 'material-ui/Progress';
import ErrorSnackBar from "./ErrorSnackBar";
import {LanguagesQuery} from "./gqlQueries";
import {withStyles} from "material-ui";
import {translate} from "react-i18next";

const styles = (theme) => ({
    loadingOverlay : {
        position: "absolute",
        left: "50%",
        top: "50%",
        display: "block",
        transform: "translate( -50%, -50% )"
    }
});

class VanityUrlLanguageData extends React.Component {

    constructor(props) {
        super(props);
        this.renderChildren = this.renderChildren.bind(this)
    }

    renderChildren(languages) {
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                languages: languages
            })
        })
    }

    render() {
        let { t, classes } = this.props;
        return <Query fetchPolicy={'network-only'} query={LanguagesQuery} variables={{path: this.props.path}}>
            { ({loading, error, data}) => {

                if (error) {
                    console.log("Error when fetching data: " + error);
                    return <ErrorSnackBar error={t('label.errors.loadingSiteLanguages')}/>
                }

                if (loading) {
                    return <div className={classes.loadingOverlay}><CircularProgress/></div>
                }

                let languages = [];
                if (data.jcr && data.jcr.nodeByPath) {
                    languages = _.sortBy(data.jcr.nodeByPath.site.languages, 'code');
                }

                return <div>{this.renderChildren(languages)}</div>
            }}
        </Query>
    }
}

VanityUrlLanguageData = withStyles(styles)(translate('site-settings-seo')(VanityUrlLanguageData));

export {VanityUrlLanguageData};
