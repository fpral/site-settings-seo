import React from 'react';
import {AppBar, MuiThemeProvider, Paper, Reboot, Toolbar, Typography, withStyles} from 'material-ui';
import {store, theme} from '@jahia/react-dxcomponents';
import {client} from '@jahia/apollo-dx';
import {VanityUrlsTable} from "./VanityUrlsTable";
import {ApolloProvider} from 'react-apollo';
import {Provider} from 'react-redux'

const styles = theme => ({
    root: theme.mixins.gutters({
        padding: 16,
        margin: theme.spacing.unit * 3,
    }),
});

let SeoSiteSettings = function (props) {

    return (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <ApolloProvider client={client}>
                    <div>
                        <AppBar position="static" >
                            <Toolbar>
                                <Typography type="title" color="inherit">
                                    SEO
                                </Typography>
                            </Toolbar>
                        </AppBar>

                        <Paper elevation={1} className={props.classes.root}>
                            <VanityUrlsTable></VanityUrlsTable>
                        </Paper>
                    </div>
                </ApolloProvider>
            </Provider>
        </MuiThemeProvider>
    )
};

SeoSiteSettings = withStyles(styles)(SeoSiteSettings);

export {SeoSiteSettings};
