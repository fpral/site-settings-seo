import React from 'react';
import {AppBar, Toolbar, Typography, withStyles, createMuiTheme} from 'material-ui';
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
        }
    }
});

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.global
    },
    main: {
        minHeight: 'calc(100% - 94px)',
        marginTop: 64
    },
    footer: {
        fontSize: '11px',
        textTransform: 'uppercase',
        fontFamily: theme.typography.fontFamily,
        fontWeight: 600,
        padding: "8px",
        textAlign: "center",
        color: theme.palette.text.hint
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
            <section className={this.props.classes.root}>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                        {this.props.t('label.title')} - {this.props.dxContext.siteTitle}
                    </Typography>
                    <SearchField onChangeFilter={this.onChangeFilter}/>
                    </Toolbar>
                </AppBar>
                <section className={this.props.classes.main}>
                    <VanityUrlTableData
                        {...this.props}
                        {...this.state}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                        path={this.props.dxContext.mainResourcePath}
                    />
                </section>
                <footer className={this.props.classes.footer}>
                    {this.props.t('label.copyright')}
                </footer>
            </section>
        )
    }
}

SiteSettingsSeoApp = withStyles(styles)(translate('site-settings-seo')(SiteSettingsSeoApp));

let SiteSettingsSeo = function (props) {
    return (
        <DxContextProvider dxContext={props.dxContext} i18n apollo redux mui={theme}>
            <SiteSettingsSeoApp {...props} />
        </DxContextProvider>
    );
};

export {SiteSettingsSeo};
