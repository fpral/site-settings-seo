import React from 'react';
import {Toolbar, Typography, withTheme, Button, IconButton} from 'material-ui';
import {DxContextProvider, SearchBar, SettingsLayout, ThemeTester} from '@jahia/react-dxcomponents';
import {VanityUrlTableData} from "./VanityUrlTableData";
import {PredefinedFragments} from "@jahia/apollo-dx";
import {translate} from 'react-i18next';
import {Selection} from "./Selection";
import gql from "graphql-tag";
import {compose, graphql} from 'react-apollo';
import {Delete, Publish, SwapHoriz, Info} from "material-ui-icons";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import * as _ from 'lodash';
import MoveInfoDialog from "./MoveInfoDialog";
import {DefaultVanityUrlFields} from "./fragments";
import CloseIcon from 'material-ui-icons/Close';


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

            confirmationIconDialog: {
                open : false,
                openSnackBar : false,
                urlPair:[]
            }
        };
        this.onChangeSelection = this.onChangeSelection.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this);
        this.onSearchBlur = this.onSearchBlur.bind(this);
        this.onMoveInfoDialog = this.onMoveInfoDialog.bind(this);
        this.onPublishIconDialog = this.onPublishIconDialog.bind(this);
        this.onSnackBar = this.onSnackBar.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.publish = function(selection, event) {
            const nodes = [];
            var i;
            for(i=0; i<selection.length; i++){
                nodes[i] = selection[i].uuid;
            }
            const variables = {pathsOrIds: nodes};
            props.publish({variables:variables});
        };

        this.mutationPlaceholder = function(selection, event) {
            console.log(selection);
            console.log(event);
        };

        this.actions = {
            deleteAction: {
                buttonLabel: "Delete",
                buttonIcon: <Delete/>,
                tableColor: props.theme.palette.error.light,
                generalColor: props.theme.palette.error.light,
                call: this.mutationPlaceholder
            },
            publishAction: {
                buttonLabel: "Publish",
                buttonIcon: <Publish/>,
                tableColor:"#fff",
                generalColor: props.theme.palette.warning.light,
                call: this.onPublishIconDialog
            },
            publishDeleteAction: {
                buttonIcon: <Delete/>,
                tableColor:"#fff",
                call: this.mutationPlaceholder
            },
            moveAction: {
                buttonLabel: "Move",
                buttonIcon: <SwapHoriz/>,
                tableColor: props.theme.palette.primary.main,
                generalColor: props.theme.palette.primary.main,
                call: this.mutationPlaceholder
            },
            moveInfo: {
                buttonIcon: <Info/>,
                tableColor:"#fff",
                call: this.onMoveInfoDialog
            },
            setDefaultAction: {
                call: (data, event) => {
                    props.setProperty({
                        variables: {
                            id: data.urlPair.uuid,
                            property: 'j:default',
                            value: data.defaultUrl.toString(),
                            lang: contextJsParameters.uilang
                        }
                    })
                }
            },
            setActiveAction: {
                call: (data, event) => {
                    props.setProperty({
                        variables: {
                            id: data.urlPair.uuid,
                            property: 'j:active',
                            value: data.active.toString(),
                            lang: contextJsParameters.uilang
                        }
                    });
                }
            },
            setLanguage: {
                call: (data) => {
                    props.setProperty({
                        variables: {
                            id: data.urlPair.uuid,
                            property: 'jcr:language',
                            value: data.language,
                            lang: contextJsParameters.uilang
                        }
                    });
                }
            }
        }
    }

    onPublishIconDialog = (urlPair) => {
        this.setState({
            confirmationIconDialog : {
                open : !this.state.confirmationIconDialog.open,
                urlPair : urlPair,
                openSnackBar:false
            }
        })
    };

    handleClick(selection, event){
        (selection.length == 0)? this.publish( this.state.confirmationIconDialog.urlPair, event) : this.publish(selection, event);
        this.setState({
            confirmationIconDialog: {
                open: false,
                openSnackBar: true
            }
        })
    };

    closeDialog() {
        this.setState({
            confirmationIconDialog: {
                open: false
            }
        })
    };

    onSnackBar = () => {
        this.setState({
            confirmationIconDialog : {
                openSnackBar : !this.state.confirmationIconDialog.openSnackBar
            }
        })
    };

    onMoveInfoDialog = () => {
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

    onChangePage(event, newPage) {
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
                <Dialog open={this.state.confirmationIconDialog.open} fullWidth={true} onClose={this.closeDialog} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to publish ?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            Cancel
                        </Button>
                        <Button key={this.actions.publishAction.buttonLabel}
                                onClick={(event) => {this.handleClick(this.state.selection, event)}}
                                color="primary" autoFocus>
                            {this.actions.publishAction.buttonLabel}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.confirmationIconDialog.openSnackBar} onClose={this.onSnackBar} autoHideDuration={3000}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'left',}}>
                    <Typography>Publication job started on background</Typography>
                </Snackbar>
            </SettingsLayout>
        )
    }
}

const setProperty = gql`
            mutation setProperty($id: String!, $value: String!, $property:String!, $lang: String!){
                jcr{
                    mutateNodes(pathsOrIds: [$id]){
                        mutateProperty(name:$property){
                            setValue(value:$value)
                        }
                    }
                }
                reloadCache:jcr {
                    mutateNodes(pathsOrIds: [$id]){
                        node {
                            ...DefaultVanityUrlFields
                        }
                    }
                }
            }
            ${DefaultVanityUrlFields}
            ${PredefinedFragments.nodeCacheRequiredFields.gql}
            `;

const publication = gql`
            mutation mutateNodes($pathsOrIds: [String!]!){
                jcr{
                    mutateNodes(pathsOrIds: $pathsOrIds){
                        publish(languages:"en")
                        }
                    }
                }
            `;


SiteSettingsSeoApp = compose(
    withTheme(),
    graphql(setProperty, {name: 'setProperty'}),
    graphql(publication, {name: 'publish'}),
    (translate('site-settings-seo'))
)(SiteSettingsSeoApp);

let SiteSettingsSeo = function (props) {
    return (
        <DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
            <SiteSettingsSeoApp {...props} publish={publication}/>
        </DxContextProvider>
    );
};

export {SiteSettingsSeo};
