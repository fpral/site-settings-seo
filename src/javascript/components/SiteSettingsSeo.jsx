import React from 'react';
import {Toolbar, Typography} from 'material-ui';
import {DxContextProvider, LanguageSwitcher, SettingsLayout, store} from '@jahia/react-dxcomponents';
import {client} from '@jahia/apollo-dx';
import {VanityUrlTableData} from "./VanityUrlTableData";
import {translate} from 'react-i18next';
import {SearchField} from "./SearchField";

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
            <SettingsLayout footer={this.props.t('label.copyright')} appBar={
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        {this.props.t('label.title')} - {this.props.dxContext.siteTitle}
                    </Typography>
                    <SearchField onChangeFilter={this.onChangeFilter}/>
                </Toolbar>
            }>
                <VanityUrlTableData
                    {...this.props}
                    {...this.state}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                    path={this.props.dxContext.mainResourcePath}
                />
            </SettingsLayout>
        )
    }
}

SiteSettingsSeoApp = translate('site-settings-seo')(SiteSettingsSeoApp);

let SiteSettingsSeo = function (props) {
    return (
        <DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
            <SiteSettingsSeoApp {...props} />
        </DxContextProvider>
    );
};

export {SiteSettingsSeo};
