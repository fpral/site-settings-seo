import React from 'react';
import {Toolbar, Typography, withTheme, Button} from 'material-ui';
import {DxContextProvider, SearchBar, SettingsLayout, ThemeTester} from '@jahia/react-dxcomponents';
import {VanityUrlTableData} from "./VanityUrlTableData";
import {translate} from 'react-i18next';
import {Selection} from "./Selection";
import gql from "graphql-tag";
import {compose, graphql} from 'react-apollo';
import {Delete, Publish, SwapHoriz, Info} from "material-ui-icons";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import * as _ from 'lodash';
import MoveInfoDialog from "./MoveInfoDialog";

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

            confirmationIconDialog:{
                open : false,
                showSnackBar:false,
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
                call: this.publish
            },
            publishActionIcon:{
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
                call: this.mutationPlaceholder
            },
            setActiveAction: {
                call: this.mutationPlaceholder
            }
        }
    }

    onPublishIconDialog = (urlPair) => {
        this.setState({
            confirmationIconDialog : {
                open : !this.state.confirmationIconDialog.open,
                urlPair : urlPair
            }
        });
    };

    onSnackBar = () => {
        this.setState({
            confirmationIconDialog : {
                open : !this.state.confirmationIconDialog.showSnackBar,
            }
        });
    }

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
                <Dialog open={this.state.confirmationIconDialog.open} fullWidth={true} onClose={this.onPublishIconDialog} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to perform this action ?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onPublishIconDialog} color="primary">
                            Cancel
                        </Button>
                        <Button key={this.actions.publishAction.buttonLabel}
                                onClick={(event) => { this.actions.publishAction.call(this.state.confirmationIconDialog.urlPair, event); this.onPublishIconDialog()}}
                                color="primary" autoFocus>
                            {this.actions.publishAction.buttonLabel}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.confirmationIconDialog.showSnackBar} onClose={this.state.confirmationIconDialog.showSnackBar} autoHideDuration={3000}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'left',}}>
                    <Typography>Publication job started on background</Typography>
                </Snackbar>
            </SettingsLayout>
        )
    }
}

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
