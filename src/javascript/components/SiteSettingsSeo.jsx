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
        background: {
            global: 'rgb(234, 234, 234)'
        },
        primary: {
            main: blueGrey[500],
            light: blueGrey[300],
            dark: blueGrey[700]
        },
        secondary: {
            main: lightBlue[500],
            light: lightBlue[300],
            dark: lightBlue[700]
        }
    },
    typography: {
        display4: {
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: 1.42857,
            letterSpacing: 0,
            color: '#777'
        }
    }
});

const styles = theme => ({
    root: {
        height: '100%',
        backgroundColor: theme.palette.background.global
    },
});

const bodyStyles = theme => ({
    root: theme.mixins.gutters({
        margin: theme.spacing.unit * 2,
        backgroundColor: theme.palette.background.default
    })
});

const footerStyles = theme => ({
    root: {
        backgroundColor: 'inherit'
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
            <SiteSettings>
                <SiteSettingsHeader>
                    <Typography variant="title" color="inherit">
                        {this.props.t('label.title')} - {this.props.dxContext.siteTitle}
                    </Typography>
                    <SearchField onChangeFilter={this.onChangeFilter}/>
                </SiteSettingsHeader>
                <SiteSettingsBody>
                    <VanityUrlTableData
                        {...this.props}
                        {...this.state}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                        path={this.props.dxContext.mainResourcePath}
                    />
                </SiteSettingsBody>
                <SiteSettingsFooter/>
            </SiteSettings>
        )
    }
}

class SiteSettings extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Paper elevation={0} className={this.props.classes.root}>
                {this.props.children}
            </Paper>
        );
    }
}

class SiteSettingsHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    {this.props.children}
                </Toolbar>
            </AppBar>
        );
    }
}

class SiteSettingsBody extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Paper elevation={1} className={this.props.classes.root}>
                {this.props.children}
            </Paper>
        );
    }
}

class SiteSettingsFooter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Paper elevation={0} className={this.props.classes.root}>
                <Typography variant="display4" align="center">
                    {this.props.t('label.copyright')}
                </Typography>
            </Paper>
        );
    }
}

SiteSettingsSeoApp = translate('site-settings-seo')(SiteSettingsSeoApp);
SiteSettings = withStyles(styles)(SiteSettings);
SiteSettingsHeader = translate('site-settings-seo')(SiteSettingsHeader);
SiteSettingsBody = withStyles(bodyStyles)(SiteSettingsBody);
SiteSettingsFooter = withStyles(footerStyles)(translate('site-settings-seo')(SiteSettingsFooter));

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
