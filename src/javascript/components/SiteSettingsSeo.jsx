import React from 'react';
import {Toolbar, Typography, withTheme, withStyles, Button, IconButton, CircularProgress} from 'material-ui';
import {DxContextProvider, SearchBar, SettingsLayout} from '@jahia/react-dxcomponents';
import {LanguageSelector} from "./LanguageSelector";
import {VanityUrlTableView} from "./VanityUrlTableView";
import {translate} from 'react-i18next';
import {Selection} from "./Selection";
import {compose} from 'react-apollo';
import {Add, Delete, Publish, SwapHoriz, Info} from "material-ui-icons";
import * as _ from 'lodash';
import MoveInfo from "./MoveInfo";
import Publication from "./Publication";
import Deletion from "./Deletion";
import PublishDeletion from "./PublishDeletion";
import Move from "./Move";
import AddVanityUrl from "./AddVanityUrl";
import {VanityMutationsProvider, withVanityMutationContext} from "./VanityMutationsProvider";
import {withNotifications} from '@jahia/react-dxcomponents';
import {VanityUrlLanguageData} from "./VanityUrlLanguageData";
import {VanityUrlTableData} from "./VanityUrlTableData";

const styles = (theme) => ({

    title: {
        width: '100%'
    },

    languageSelector: {

        marginRight: theme.spacing.unit,
        color: 'inherit',

        // Disable any underlining.
        '&:before': {
            background: 'transparent !important'
        },
        '&:after': {
            background: 'transparent'
        }
    },

    languageSelectorIcon: {
        color: 'inherit'
    }

});

const SiteSettingsSeoConstants = {
    MAPPING_REG_EXP: new RegExp("^/?(?!.*/{2,})[a-zA-Z_0-9\\-\\./]+$"),
    NB_NEW_MAPPING_ROWS: 5,
    TABLE_POLLING_INTERVAL: 2000
};

class SiteSettingsSeoApp extends React.Component {

    constructor(props) {
        super(props);

        let { notificationContext, t } = this.props;

        this.state = {
            filterText: '',
            languages: this.props.languages.map(language => language.code),
            currentPage: 0,
            pageSize: 5,
            appBarStyle: {},
            selection: [],
            publication: {
                open: false,
                urlPairs: []
            },
            deletion: {
                open:false,
                urlPairs:[]
            },
            move: {
                open: false,
                urlPairs: []
            },
            moveInfo: {
                open: false,
                path: ''
            },
            publishDeletion: {
                open: false,
                urlPairs: []
            },
            add: {
                open: false,
                availableLanguages: []
            }

        };

        this.onChangeSelection = this.onChangeSelection.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this);
        this.onSearchBlur = this.onSearchBlur.bind(this);
        this.onSelectedLanguagesChanged = this.onSelectedLanguagesChanged.bind(this);

        this.openMoveInfo = this.openMoveInfo.bind(this);
        this.closeMoveInfo = this.closeMoveInfo.bind(this);

        this.openMove = this.openMove.bind(this);
        this.closeMove = this.closeMove.bind(this);

        this.openPublication = this.openPublication.bind(this);
        this.closePublication = this.closePublication.bind(this);
        this.openDeletion = this.openDeletion.bind(this);
        this.closeDeletion = this.closeDeletion.bind(this);
        this.openPublishDeletion = this.openPublishDeletion.bind(this);
        this.closePublishDeletion = this.closePublishDeletion.bind(this);

        this.openAdd = this.openAdd.bind(this);
        this.closeAdd = this.closeAdd.bind(this);

        this.actions = {
            deleteAction: {
                priority: 3,
                buttonLabel: "Delete",
                buttonIcon: <Delete/>,
                className: "delete",
                call: this.openDeletion
            },
            publishAction: {
                priority: 2,
                buttonLabel: "Publish",
                buttonIcon: <Publish/>,
                className: "publish",
                call: this.openPublication
            },
            publishDeleteAction: {
                buttonIcon: <Delete/>,
                className: "publishDeletion",
                call: this.openPublishDeletion
            },
            moveAction: {
                priority: 1,
                buttonLabel: "Move",
                buttonIcon: <SwapHoriz/>,
                className: "move",
                call: this.openMove
            },
            moveInfo: {
                buttonIcon: <Info/>,
                className: "move",
                call: this.openMoveInfo
            },
            addAction: {
                buttonIcon: <Add/>,
                className: "add",
                call: this.openAdd
            },
            updateVanity: {
                call: (data, onSuccess, onError) => {
                    try {
                        props.vanityMutationsContext.update([data.urlPair.uuid],
                            data.defaultMapping != null ? data.defaultMapping.toString() : undefined,
                            data.active != null ? data.active.toString() : undefined,
                            data.language,
                            data.url)

                            .then(onSuccess)
                            .catch((errors) => {
                                let err;
                                _.each(errors.graphQLErrors, (error) => {
                                    if (error.errorType === "GqlConstraintViolationException") {
                                        err = this.props.t("label.errors.mappingAlreadyExist", error.extensions);
                                    } else {
                                        err = error.message;
                                    }
                                })
                                onError(err);
                            });
                    } catch (e) {
                        onError(e);
                        notificationContext.notify(t("label.errors." + (e.name ? e.name : "Error")));
                    }
                }
            }
        }
    }

    openMoveInfo = (targetPath) => {
        this.setState({
            moveInfo: {
                open: true,
                path: targetPath
            }
        })
    };

    closeMoveInfo() {
        this.setState({
            moveInfo: {
                open: false,
                path: ''
            }
        })
    };

    openMove = (urlPairs) => {
        this.setState({
            move: {
                open: true,
                urlPairs: urlPairs
            }
        })
    };

    closeMove() {
        this.setState({
            move: {
                open: false,
                urlPairs: []
            },
            selection:[]
        })
    };

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
            },
            selection: []
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
            },
            selection: []
        })
    };

    openPublishDeletion = (urlPairs) => {
        this.setState({
            publishDeletion: {
                open: true,
                urlPairs: urlPairs
            }
        })
    };

    closePublishDeletion = (urlPairs) => {
        this.setState({
            publishDeletion: {
                open: false,
                urlPairs: []
            }
        })
    };

    openAdd = (path, languages) => {
        this.setState({
            add: {
                open: true,
                path: path,
                availableLanguages: languages
            }
        })
    };

    closeAdd() {
        this.setState({
            add: {
                open: false,
                availableLanguages: []
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

    onSelectedLanguagesChanged(selectedLanguageCodes) {
        this.setState({
            languages: selectedLanguageCodes
        });
    }

    render() {
        let { dxContext, t, classes } = this.props;

        let polling = !(this.state.publication.open || this.state.deletion.open || this.state.move.open || this.state.moveInfo.open || this.state.publishDeletion.open || this.state.add.open);

        return <SettingsLayout appBarStyle={this.state.appBarStyle} footer={t('label.copyright')} appBar={
            <Toolbar>
                <Typography variant="title" color="inherit" className={classes.title}>
                    {t('label.title')} - {dxContext.siteTitle}
                </Typography>

                <LanguageSelector
                    languages={this.props.languages}
                    selectedLanguageCodes={this.state.languages}
                    emptySelectionAllowed={false}
                    className={classes.languageSelector}
                    classes={{icon: classes.languageSelectorIcon}}
                    onSelectionChange={this.onSelectedLanguagesChanged}
                />

                <SearchBar placeholderLabel={t('label.filterPlaceholder')} onChangeFilter={this.onChangeFilter} onFocus={this.onSearchFocus} onBlur={this.onSearchBlur}/>
            </Toolbar>
        }>

            <Selection selection={this.state.selection} onChangeSelection={this.onChangeSelection} actions={this.actions}/>

            <VanityUrlTableData
                {...this.state}
                path={dxContext.mainResourcePath}
                lang={dxContext.lang}
                poll={polling ? SiteSettingsSeoConstants.TABLE_POLLING_INTERVAL : 0}
            >
                <VanityUrlTableView
                    {...this.state}
                    languages={this.props.languages}
                    actions={this.actions}
                    onChangeSelection={this.onChangeSelection}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                />
            </VanityUrlTableData>

            {this.state.move.open && <Move
                {...this.state.move}
                path={dxContext.mainResourcePath}
                lang={dxContext.lang}
                onClose={this.closeMove}
            />}

            {this.state.moveInfo.open && <MoveInfo
                {...this.state.moveInfo}
                onClose={this.closeMoveInfo}
            />}

            {this.state.publication.open && <Publication
                {...this.state.publication}
                onClose={this.closePublication}
            />}

            {this.state.deletion.open && <Deletion
                {...this.state.deletion}
                onClose={this.closeDeletion}
            />}

            {this.state.publishDeletion.open && <PublishDeletion
                {...this.state.publishDeletion}
                onClose={this.closePublishDeletion}
            />}

            {this.state.add.open && <AddVanityUrl
                {...this.state.add}
                filterText={''}
                onClose={this.closeAdd}
                defaultLanguage={dxContext.lang}
            />}

        </SettingsLayout>
    }
}

SiteSettingsSeoApp = compose(
    withNotifications(),
    withTheme(),
    withStyles(styles),
    withVanityMutationContext(),
    translate('site-settings-seo')
)(SiteSettingsSeoApp);

let SiteSettingsSeo = function (props) {
    return (
        <DxContextProvider dxContext={props.dxContext} i18n apollo redux mui>
            <VanityMutationsProvider lang={props.dxContext.lang} vanityMutationsContext={{}}>
                <VanityUrlLanguageData path={props.dxContext.mainResourcePath}>
                    <SiteSettingsSeoApp {...props}/>
                </VanityUrlLanguageData>
            </VanityMutationsProvider>
        </DxContextProvider>
    );
};

export {SiteSettingsSeo, SiteSettingsSeoConstants};
