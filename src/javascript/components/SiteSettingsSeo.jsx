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

            publicationConfirmationDialog: {
                open: false,
                urlPair: []
            },
            publicationStartedNotification: {
                openSnackBar: false
            }
        };
        this.onChangeSelection = this.onChangeSelection.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this);
        this.onSearchBlur = this.onSearchBlur.bind(this);
        this.onMoveInfoDialog = this.onMoveInfoDialog.bind(this);
        this.onPublishClicked = this.onPublishClicked.bind(this);
        this.openPublicationStartedNotification = this.openPublicationStartedNotification.bind(this);
        this.closePublicationConfirmationDialog = this.closePublicationConfirmationDialog.bind(this);
        this.onPublishConfirmed = this.onPublishConfirmed.bind(this);

        this.publish = function(selection, event) {
            const uuids = _.map(selection, "uuid");
            props.publish({variables: {pathsOrIds: uuids}});
        };

        this.mutationPlaceholder = function(selection, event) {
            console.log(selection);
            console.log(event);
        };

        this.actions = {
            deleteAction: {
                buttonLabel: "Delete",
                buttonIcon: <Delete/>,
                className: "delete",
                call: this.mutationPlaceholder
            },
            publishAction: {
                buttonLabel: "Publish",
                buttonIcon: <Publish/>,
                className: "publish",
                call: this.onPublishClicked
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

    onPublishClicked = (urlPair) => {
        this.setState({
            publicationConfirmationDialog: {
                open: true,
                urlPair: urlPair
            },
            publicationStartedNotification: {
                openSnackBar: false
            }
        })
    };

    onPublishConfirmed(selection, event) {
        this.publish(selection, event);
        this.setState({
            publicationConfirmationDialog: {
                open: false,
            },
            publicationStartedNotification: {
                openSnackBar: true
            }
        })
    };

    closePublicationConfirmationDialog() {
        this.setState({
            publicationConfirmationDialog: {
                open: false
            }
        })
    };

    openPublicationStartedNotification = () => {
        this.setState({
            publicationStartedNotification: {
                openSnackBar: true
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

                <Dialog open={this.state.publicationConfirmationDialog.open} fullWidth={true} onClose={this.closePublicationConfirmationDialog} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{t('label.dialogs.publish.title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {t('label.dialogs.publish.content')}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.closePublicationConfirmationDialog} color="primary">
                            Cancel
                        </Button>
                        <Button key={this.actions.publishAction.buttonLabel}
                                onClick={(event) => {this.onPublishConfirmed(this.state.publicationConfirmationDialog.urlPair, event)}}
                                color="primary" autoFocus>
                            {this.actions.publishAction.buttonLabel}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.publicationStartedNotification.openSnackBar} autoHideDuration={3000}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                    <Typography>{t('label.publishSnackBar')}</Typography>
                </Snackbar>

            </SettingsLayout>
        )
    }
}

const setProperty = gql`
            mutation setProperty($id: String!, $value: String!, $property:String!, $lang: String!) {
                jcr {
                    mutateNodes(pathsOrIds: [$id]) {
                        mutateProperty(name:$property) {
                            setValue(value:$value)
                        }
                    }
                }
                reloadCache: jcr {
                    mutateNodes(pathsOrIds: [$id]) {
                        node {
                            ...DefaultVanityUrlFields
                        }
                    }
                }
            }
            ${DefaultVanityUrlFields}
            ${PredefinedFragments.nodeCacheRequiredFields.gql}
        `;

const publish = gql`
            mutation mutateNodes($pathsOrIds: [String!]!) {
                jcr {
                    mutateNodes(pathsOrIds: $pathsOrIds) {
                        publish
                    }
                }
            }
        `;


SiteSettingsSeoApp = compose(
    withTheme(),
    graphql(setProperty, {name: 'setProperty'}),
    graphql(publish, {name: 'publish'}),
    (translate('site-settings-seo'))
)(SiteSettingsSeoApp);

let SiteSettingsSeo = function (props) {
    return (
        <DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
            <SiteSettingsSeoApp {...props} publish={publish}/>
        </DxContextProvider>
    );
};

export {SiteSettingsSeo};
