import React from 'react';
import {AppBar, Paper, Toolbar, Typography, withStyles} from 'material-ui';
import {DxContextProvider, LanguageSwitcher, store, theme} from '@jahia/react-dxcomponents';
import {client} from '@jahia/apollo-dx';
import {VanityUrlTable} from "./VanityUrlTable";
import {grey} from 'material-ui/colors'
import {translate} from 'react-i18next';
import {SiteName} from './SiteName';

const styles = theme => ({
    root: theme.mixins.gutters({
        backgroundColor: grey[100]
    }),
});

let SiteSettingsSeoApp = function (props) {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography type="title" color="inherit">
                        {props.t('label.title')} - <SiteName path={props.dxContext.mainResourcePath}/>
                    </Typography>
                </Toolbar>
            </AppBar>

            <Paper elevation={1} className={props.classes.root}>
                <VanityUrlTable path={props.dxContext.mainResourcePath} type={'jmix:vanityUrlMapped'}></VanityUrlTable>
            </Paper>
        </div>
    )
}


SiteSettingsSeoApp = withStyles(styles)(translate('site-settings-seo')(SiteSettingsSeoApp));


let SiteSettingsSeo = function (props) {
    return (<DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
                <SiteSettingsSeoApp {...props} />
            </DxContextProvider>
    )
};

export {SiteSettingsSeo};
