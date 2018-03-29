import React from 'react';
import {Toolbar, Typography, withTheme} from 'material-ui';
import {DxContextProvider, SearchBar, SettingsLayout} from '@jahia/react-dxcomponents';
import {VanityUrlTableData} from "./VanityUrlTableData";
import {translate} from 'react-i18next';
import {Selection} from "./Selection";
import {Delete, Publish, SwapHoriz} from "material-ui-icons"
import * as _ from 'lodash';

class SiteSettingsSeoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {filterText: '', currentPage: 0, pageSize: 5, appBarStyle: {}, selection: []};
        this.onChangeSelection = this.onChangeSelection.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this);
        this.onSearchBlur = this.onSearchBlur.bind(this);

        this.mutationPlaceholder = function(selection, event) {
            console.log(selection);
            console.log(event);
        };

        this.actions = {
            deleteAction:{
                buttonLabel: "Delete",
                buttonIcon: <Delete/>,
                color:"#f00",
                call: this.mutationPlaceholder
            },
            publishAction:{
                buttonLabel: "Publish",
                buttonIcon: <Publish/>,
                color:"#f50",
                call: this.mutationPlaceholder
            },
            moveAction:{
                buttonLabel: "Move",
                buttonIcon: <SwapHoriz/>,
                color:"#06F",
                call: this.mutationPlaceholder
            },
            setDefaultAction:{
                call: this.mutationPlaceholder
            },
            setActiveAction:{
                call: this.mutationPlaceholder
            }
        }
    }

    onChangeSelection(urlPair) {
        if (!urlPair) {
            // Clear selection
            this.setState({
                selection: []
            })
        } else {
            // Switch selected uuid
            this.setState((previous) => ({
                selection: (_.find(previous.selection, (p)=> p.uuid === urlPair.uuid)) ? _.filter(previous.selection, (p) => (urlPair.uuid !== p.uuid)) : _.concat(previous.selection, urlPair)
            }))
        }
    }

    onChangeFilter = (filterText) => {
        this.setState({
            filterText: filterText,
            currentPage: 0
        });
    }

    onChangePage(newPage) {
        this.setState({currentPage: newPage});
    }

    onChangeRowsPerPage(newRowsPerPage) {
        this.setState({pageSize: newRowsPerPage});
    }

    onSearchFocus() {
        this.setState({
            appBarStyle: {
                backgroundColor: this.props.theme.palette.primary.dark
            }
        })
    }

    onSearchBlur() {
        this.setState({
            appBarStyle: {}
        })
    }

    render() {
        let { dxContext, t, classes } = this.props;
        return (
            <SettingsLayout appBarStyle={this.state.appBarStyle} footer={t('label.copyright')} appBar={
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        {t('label.title')} - {dxContext.siteTitle}
                    </Typography>
                    <SearchBar placeholderLabel={t('label.filterPlaceholder')} onChangeFilter={this.onChangeFilter} onFocus={this.onSearchFocus} onBlur={this.onSearchBlur}/>
                </Toolbar>
            }>

                <Selection selection={this.state.selection} onChangeSelection={this.onChangeSelection} actions={this.actions}/>

                <VanityUrlTableData
                    {...this.props}
                    {...this.state}
                    onChangeSelection={this.onChangeSelection}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                    actions={this.actions}
                    path={dxContext.mainResourcePath}
                />
            </SettingsLayout>
        )
    }
}

SiteSettingsSeoApp = withTheme()(translate('site-settings-seo')(SiteSettingsSeoApp));

let SiteSettingsSeo = function (props) {
    return (
        <DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
            <SiteSettingsSeoApp {...props} />
        </DxContextProvider>
    );
};

export {SiteSettingsSeo};
