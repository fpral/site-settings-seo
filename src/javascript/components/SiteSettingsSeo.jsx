import React from 'react';
import {AppBar, Paper, Grid, Toolbar, Typography, withStyles, createMuiTheme, MuiThemeProvider} from 'material-ui';
import {DxContextProvider, LanguageSwitcher, store} from '@jahia/react-dxcomponents';
import {client} from '@jahia/apollo-dx';
import {VanityUrlTableData} from "./VanityUrlTableData";
import {translate} from 'react-i18next';
import {SearchField} from "./SearchField";
import {blueGrey, lightBlue} from 'material-ui/colors/index'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blueGrey[500],
            light: blueGrey[300],
            dark: blueGrey[700]
        },
        secondary: {
            main: lightBlue[500],
            light: lightBlue[300],
            dark: lightBlue[700]
        },
    }
});

const styles = theme => ({
    body: theme.mixins.gutters({
        backgroundColor: theme.palette.background.default
    }),
    footer: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit
    }
});

class SiteSettingsSeoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {filterText:'', currentPage:0, pageSize:5};
        this.onChangePage.bind(this);
        this.onChangeRowsPerPage.bind(this);
        this.onChangeFilter.bind(this);
    }

    onChangeFilter = (filterText) => {
        this.setState({
            filterText: filterText,
            currentPage: 0
        });
    }

    onChangePage = (newPage) => {
        this.setState({currentPage: newPage});
    }

    onChangeRowsPerPage = (newRowsPerPage) => {
        this.setState({pageSize: newRowsPerPage});
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            {this.props.t('label.title')} - {this.props.dxContext.siteTitle}
                        </Typography>
                        <SearchField onChangeFilter={this.onChangeFilter}/>
                    </Toolbar>
                </AppBar>
                <Paper elevation={1} className={this.props.classes.body}>
                    <VanityUrlTableData
                        {...this.props}
                        {...this.state}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                        path={this.props.dxContext.mainResourcePath}
                    />
                </Paper>
                <Paper elevation={1} className={this.props.classes.footer}>
                    <Typography variant="caption" align="center">
                        {this.props.t('label.copyright')}
                    </Typography>
                </Paper>
            </div>
        )
    }
}

SiteSettingsSeoApp = withStyles(styles)(translate('site-settings-seo')(SiteSettingsSeoApp));

let SiteSettingsSeo = function (props) {
    return (
        <DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
            <MuiThemeProvider theme={theme}>
                <SiteSettingsSeoApp {...props} />
            </MuiThemeProvider>
        </DxContextProvider>
    );
};

export {SiteSettingsSeo};
