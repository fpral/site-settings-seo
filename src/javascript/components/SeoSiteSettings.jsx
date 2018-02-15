import React from 'react';
import {AppBar, Paper, Toolbar, Typography, withStyles} from 'material-ui';
import {DxContextProvider, LanguageSwitcher, store, theme} from '@jahia/react-dxcomponents';
import {client} from '@jahia/apollo-dx';
import {VanityUrlsTable} from "./VanityUrlsTable";
import {grey} from 'material-ui/colors'
import {translate} from 'react-i18next';
import {SiteName} from './SiteName';

const styles = theme => ({
    root: theme.mixins.gutters({
        backgroundColor: grey[100]
    }),
});

let SeoSiteSettingsApp = function (props) {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography type="title" color="inherit">
                        {props.t('label.title')} - <SiteName path={contextJsParameters.mainResourcePath}/>
                    </Typography>
                </Toolbar>
            </AppBar>

            <Paper elevation={1} className={props.classes.root}>
                <VanityUrlsTable path={contextJsParameters.mainResourcePath} type={'jnt:page'}></VanityUrlsTable>
            </Paper>
        </div>
    )
}


SeoSiteSettingsApp = withStyles(styles)(translate('seoSettings')(SeoSiteSettingsApp));


let SeoSiteSettings = function (props) {
    return (<DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
                <SeoSiteSettingsApp {...props} />
            </DxContextProvider>
    )
};

export {SeoSiteSettings};
