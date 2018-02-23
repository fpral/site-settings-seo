import React from 'react';
import {AppBar, Paper, Toolbar, Typography, withStyles} from 'material-ui';
import {DxContextProvider, LanguageSwitcher, store, theme} from '@jahia/react-dxcomponents';
import {client} from '@jahia/apollo-dx';
import {VanityUrlTableData} from "./VanityUrlTableData";
import {grey} from 'material-ui/colors'
import {translate} from 'react-i18next';
import {SearchField} from "./SearchField";

const styles = theme => ({
    body: theme.mixins.gutters({
        backgroundColor: grey[100]
    }),
    footer: {
        backgroundColor: grey[100],
        padding: theme.spacing.unit
    }
});

class SiteSettingsSeoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {filteredText:'', currentPage:0, pageSize:5};
        this.onChangePage.bind(this);
        this.onChangeRowsPerPage.bind(this);
        this.onChangeFilter.bind(this);
    }

    onChangeFilter = (filteredText) => {
        this.setState({filteredText: filteredText});
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
                        <Typography type="title" color="inherit">
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
                    <Typography type="caption" align="center">
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
            <SiteSettingsSeoApp {...props} />
        </DxContextProvider>
    );
};

export {SiteSettingsSeo};
