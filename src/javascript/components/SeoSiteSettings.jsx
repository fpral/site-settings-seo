import React from 'react';
import {AppBar, Paper, Toolbar, Typography, withStyles} from 'material-ui';
import {DxContextProvider, LanguageSwitcher, store, theme} from '@jahia/react-dxcomponents';
import {client} from '@jahia/apollo-dx';
import {VanityUrlsTable} from "./VanityUrlsTable";
import {grey} from 'material-ui/colors'

const styles = theme => ({
    root: theme.mixins.gutters({
        backgroundColor: grey[100]
    }),
});

let SeoSiteSettings = function (props) {
    return (<DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography type="title" color="inherit">
                                SEO
                            </Typography>
                            <LanguageSwitcher/>
                        </Toolbar>
                    </AppBar>

                    <Paper elevation={1} className={props.classes.root}>
                        <VanityUrlsTable></VanityUrlsTable>
                    </Paper>
                </div>
            </DxContextProvider>
    )
};

SeoSiteSettings = withStyles(styles)(SeoSiteSettings);

export {SeoSiteSettings};
