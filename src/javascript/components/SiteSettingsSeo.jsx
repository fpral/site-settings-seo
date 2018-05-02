import React from 'react';
import {Toolbar, Typography, withStyles, withTheme} from 'material-ui';
import {DxContextProvider, SearchBar, SettingsLayout, withNotifications} from '@jahia/react-dxcomponents';
import {LanguageSelector} from "./LanguageSelector";
import {VanityUrlTableView} from "./VanityUrlTableView";
import {translate} from 'react-i18next';
import {Selection} from "./Selection";
import {compose} from 'react-apollo';
import {Add, Delete, Info, Publish, SwapHoriz} from "material-ui-icons";
import * as _ from 'lodash';
import InfoButton from "./InfoButton";
import Publication from "./Publication";
import Deletion from "./Deletion";
import PublishDeletion from "./PublishDeletion";
import Move from "./Move";
import AddVanityUrl from "./AddVanityUrl";
import {VanityMutationsProvider, withVanityMutationContext} from "./VanityMutationsProvider";
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
        let {t} = this.props;

        this.state = {
            loadParams: {
                filterText: '',
                selectedLanguageCodes: this.props.languages.map(language => language.code),
                currentPage: 0,
                pageSize: 5
            },
            appBarStyle: {},
            selection: [],
            publication: {
                open: false,
                urlPairs: []
            },
            deletion: {
                open: false,
                urlPairs: []
            },
            move: {
                open: false,
                urlPairs: []
            },
            infoButton: {
                open: false,
                message: ""
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

        this.openInfoButton = this.openInfoButton.bind(this);
        this.closeInfoButton = this.closeInfoButton.bind(this);

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
                priority: 1,
                buttonLabel: t("label.actions.delete"),
                buttonIcon: <Delete/>,
                className: "delete",
                call: this.openDeletion
            },
            publishAction: {
                priority: 3,
                buttonLabel: t("label.actions.publish"),
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
                priority: 2,
                buttonLabel:  t("label.actions.move"),
                buttonIcon: <SwapHoriz/>,
                className: "move",
                call: this.openMove
            },
            infoButton: {
                buttonIcon: <Info/>,
                className: "move",
                call: this.openInfoButton
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
                            .catch(ex => { this.handleServerError(ex, onError) });
                    } catch (ex) {
                        this.handleServerError(ex, onError);
                    }
                }
            }
        }
    }

    handleServerError(ex, onError) {
        let {t} = this.props;
        let err, mess;
        if (ex.graphQLErrors && ex.graphQLErrors.length > 0) {
            let graphQLError = ex.graphQLErrors[0];
            err = t(["label.errors." + graphQLError.errorType, "label.errors.Error"]);
            mess = t(["label.errors." + graphQLError.errorType + "_message", graphQLError.message], graphQLError.extensions);
        } else {
            err = t(["label.errors." + ex.name, "label.errors.Error"]);
            mess = t(["label.errors." + ex.name + "_message", ex.message]);
        }
        onError(err, mess);
    }

    openInfoButton = (message) => {
        this.setState({
            infoButton: {
                open: true,
                message: message
            }
        })
    };

    closeInfoButton() {
        this.setState({
            infoButton: {
                open: false,
                message: ''
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
            selection: []
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
        this.setState((state) => ({
            loadParams: _.assign({}, state.loadParams, {
                filterText: filterText,
                currentPage: 0,
            })
        }));
    };

    onChangePage(newPage) {
        this.setState((state) => ({
            loadParams: _.assign({}, state.loadParams, {
                currentPage: newPage,
            })
        }));
    }

    onChangeRowsPerPage(newRowsPerPage) {
        this.setState((state) => ({
            loadParams: _.assign({}, state.loadParams, {
                pageSize: newRowsPerPage
            })
        }));
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
        this.setState((state) => ({
            loadParams: _.assign({}, state.loadParams, {
                selectedLanguageCodes: selectedLanguageCodes,
                currentPage: 0,
            })
        }));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.loadParams.selectedLanguageCodes.length === 0 && nextProps.languages && nextProps.languages.length > 0) {
            return {
                loadParams: _.assign({}, prevState.loadParams, {
                    selectedLanguageCodes: nextProps.languages.map(language => language.code),
                })
            }
        }
        return null;
    }

    render() {
        let {dxContext, t, classes} = this.props;

        let polling = !(this.state.publication.open || this.state.deletion.open || this.state.move.open || this.state.infoButton.open || this.state.publishDeletion.open || this.state.add.open);

        return <SettingsLayout appBarStyle={this.state.appBarStyle} footer={t('label.copyright')} appBar={
            <Toolbar>
                <Typography variant="title" color="inherit" className={classes.title}>
                    {t('label.title')} - {dxContext.siteTitle}
                </Typography>

                <LanguageSelector
                    languages={this.props.languages}
                    selectedLanguageCodes={this.state.loadParams.selectedLanguageCodes}
                    emptySelectionAllowed={false}
                    className={classes.languageSelector}
                    classes={{icon: classes.languageSelectorIcon}}
                    onSelectionChange={this.onSelectedLanguagesChanged}
                />

                <SearchBar placeholderLabel={t('label.filterPlaceholder')} onChangeFilter={this.onChangeFilter}
                           onFocus={this.onSearchFocus} onBlur={this.onSearchBlur}/>
            </Toolbar>
        }>

            <Selection selection={this.state.selection} onChangeSelection={this.onChangeSelection}
                       actions={this.actions}/>

            <VanityUrlTableData
                {...this.state.loadParams}
                path={dxContext.mainResourcePath}
                lang={dxContext.lang}
                poll={polling ? SiteSettingsSeoConstants.TABLE_POLLING_INTERVAL : 0}
            >
                {(rows, totalCount, numberOfPages) =>
                    <VanityUrlTableView
                        {...this.state.loadParams}
                        languages={this.props.languages}
                        rows={rows}
                        totalCount={totalCount}
                        numberOfPages={numberOfPages}
                        selection={this.state.selection}
                        actions={this.actions}
                        onChangeSelection={this.onChangeSelection}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                    />
                }
            </VanityUrlTableData>

            {this.state.move.open && <Move
                {...this.state.move}
                {...this.state.loadParams}
                path={dxContext.mainResourcePath}
                lang={dxContext.lang}
                onClose={this.closeMove}
            />}

            {this.state.infoButton.open && <InfoButton
                {...this.state.infoButton}
                onClose={this.closeInfoButton}
            />}

            {this.state.publication.open && <Publication
                {...this.state.publication}
                onClose={this.closePublication}
            />}

            {this.state.deletion.open && <Deletion
                {...this.state.deletion}
                {...this.state.loadParams}
                path={dxContext.mainResourcePath}
                lang={dxContext.lang}
                onClose={this.closeDeletion}
            />}

            {this.state.publishDeletion.open && <PublishDeletion
                {...this.state.publishDeletion}
                onClose={this.closePublishDeletion}
            />}

            {this.state.add.open && <AddVanityUrl
                {...this.state.add}
                {...this.state.loadParams}
                lang={dxContext.lang}
                onClose={this.closeAdd}
            />}

        </SettingsLayout>
    }
}

SiteSettingsSeoApp = compose(
    withNotifications(),
    withTheme(),
    withStyles(styles),
    withVanityMutationContext(),
    translate()
)(SiteSettingsSeoApp);

let SiteSettingsSeo = function (props) {
    let getI18NData = __webpack_require__ ? (ns, lang) => {
        if (ns === 'site-settings-seo') {
            try {
                return require('../../main/resources/javascript/locales/' + lang + '.json');
            } catch (e) {
            	return null;
            }
        }
        if (ns === 'react-dxcomponents') {
            try {
                return require('@jahia/react-dxcomponents/src/main/resources/javascript/locales/' + lang + '.json');
            } catch (e) {
            	return null;
            }
        }
    } : null;

    return (
        <DxContextProvider dxContext={props.dxContext} i18n={{
            ns: ['site-settings-seo', 'react-dxcomponents'], defaultNS: 'site-settings-seo', getData:getI18NData
        }} apollo redux mui>
            <VanityMutationsProvider lang={props.dxContext.lang} vanityMutationsContext={{}}>
                <VanityUrlLanguageData path={props.dxContext.mainResourcePath}>
                    {languages => <SiteSettingsSeoApp languages={languages} {...props}/>}
                </VanityUrlLanguageData>
            </VanityMutationsProvider>
        </DxContextProvider>
    );
};

export {SiteSettingsSeo, SiteSettingsSeoConstants};
