import React from 'react';
import {Toolbar, Typography, withTheme, Button, IconButton} from 'material-ui';
import {DxContextProvider, SearchBar, SettingsLayout, ThemeTester} from '@jahia/react-dxcomponents';
import {VanityUrlTableData} from "./VanityUrlTableData";
import {PredefinedFragments} from "@jahia/apollo-dx";
import {translate} from 'react-i18next';
import {Selection} from "./Selection";
import {compose, graphql} from 'react-apollo';
import {Delete, Publish, SwapHoriz, Info} from "material-ui-icons";
import * as _ from 'lodash';
import MoveInfoDialog from "./MoveInfoDialog";
import {UpdateVanityMutation} from "./gqlMutations";
import Publication from "./Publication";
import Deletion from "./Deletion";


class SiteSettingsSeoApp extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            filterText: '',
            currentPage: 0,
            pageSize: 5,
            appBarStyle: {},
            selection: [],
            moveInfoDialogPath: '',
            publication: {
                open: false,
                urlPairs: []
            },
            deletion: {
                open:false,
                urlPairs:[]
            }
        };

        this.onChangeSelection = this.onChangeSelection.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this);
        this.onSearchBlur = this.onSearchBlur.bind(this);
        this.onMoveInfoDialog = this.onMoveInfoDialog.bind(this);
        this.openPublication = this.openPublication.bind(this);
        this.closePublication = this.closePublication.bind(this);
        this.openDeletion = this.openDeletion.bind(this);
        this.closeDeletion = this.closeDeletion.bind(this);

        this.mutationPlaceholder = function(selection, event) {
            console.log(selection);
            console.log(event);
        };

        this.actions = {
            deleteAction: {
                buttonLabel: "Delete",
                buttonIcon: <Delete/>,
                className: "delete",
                call: this.openDeletion
            },
            publishAction: {
                buttonLabel: "Publish",
                buttonIcon: <Publish/>,
                className: "publish",
                call: this.openPublication
            },
            publishDeleteAction: {
                buttonIcon: <Delete/>,
                className: "delete",
                call: this.mutationPlaceholder
            },
            moveAction: {
                buttonLabel: "Move",
                buttonIcon: <SwapHoriz/>,
                className: "move",
                call: this.mutationPlaceholder
            },
            moveInfo: {
                buttonIcon: <Info/>,
                className: "move",
                call: this.onMoveInfoDialog
            },
            updateVanity: {
                call: (data) => props.updateVanity({
                    variables: {
                        ids: [data.urlPair.uuid],
                        defaultMapping: data.defaultMapping != null ? data.defaultMapping.toString() : undefined,
                        active: data.active != null ? data.active.toString() : undefined,
                        language: data.language,
                        url: data.url,
                        lang: contextJsParameters.uilang
                    }
                })
            }
        }
    }

    openPublication = (urlPairs) => {
        this.setState({
            publication: {
                open: true,
                urlPairs: urlPairs
            }
        })
    };

    closePublication() {
        this.setState({
            publication: {
                open: false,
                urlPairs: []
            }
        })
    };

    openDeletion = (urlPairs) => {
        this.setState({
            deletion: {
                open: true,
                urlPairs: urlPairs
            }
        })
    };

    closeDeletion() {
        this.setState({
            deletion: {
                open: false,
                urlPairs: []
            }
        })
    };

    onMoveInfoDialog = (path) => {
        this.setState({
            moveInfoDialogPath: path
        })
    };

    onChangeSelection(add, urlPairs) {
        if (!urlPairs) {
            // Clear selection
            this.setState({
                selection: []
            })
        } else {
            this.setState((previous) => ({
                selection: add ? _.unionBy(previous.selection, urlPairs, "uuid") : _.pullAllBy(previous.selection, urlPairs, "uuid")
            }));
        }
    }

    onChangeFilter = (filterText) => {
        this.setState({
            filterText: filterText,
            currentPage: 0
        });
    };

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
                    <ThemeTester/>
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

                <MoveInfoDialog {...this.props} path={this.state.moveInfoDialogPath} onClose={this.onMoveInfoDialog}/>

                <Publication
                    {...this.state.publication}
                    onClose={this.closePublication}/>
                <Deletion
                    {...this.state.deletion}
                    onClose={this.closeDeletion}/>
            </SettingsLayout>
        )
    }
}

SiteSettingsSeoApp = compose(
    withTheme(),
    graphql(UpdateVanityMutation, {name: 'updateVanity'}),
    translate('site-settings-seo')
)(SiteSettingsSeoApp);

let SiteSettingsSeo = function (props) {
    return (
        <DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
            <SiteSettingsSeoApp {...props}/>
        </DxContextProvider>
    );
};

export {SiteSettingsSeo};
