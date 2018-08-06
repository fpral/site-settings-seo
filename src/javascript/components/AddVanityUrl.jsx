import React from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Input,
    Paper,
    Switch,
    Grid,
    Tooltip,
    InputAdornment,
    withStyles
} from '@material-ui/core';
import {Cancel, Star, StarBorder} from '@material-ui/icons';
import {LanguageMenu} from "./LanguageMenu";
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import {withVanityMutationContext} from "./VanityMutationsProvider";
import {withNotifications} from '@jahia/react-material';
import * as _ from 'lodash';
import {SiteSettingsSeoConstants} from "./SiteSettingsSeo";

const styles = (theme) => ({
    formControl: {
        width: '100%'
    },
    button: {
        height: 18,
        width: 18,
        transform: 'scale(0.75)',
        '&:hover': {
            backgroundColor: 'inherit'
        }
    },
    cancel: {
        color:'red'
    }
});

class AddVanityUrl extends React.Component {

    constructor(props) {
        super(props);
        // get default language for the language selector
        this.defaultLanguage = this.props.lang;

        this.state = {
            mappings: this._resetMap(),
            errors: [],
            doPublish: false
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handlePublishCheckboxChange = this.handlePublishCheckboxChange.bind(this);
        this.handleDialogEntered = this.handleDialogEntered.bind(this);
        this.resetInput = this.resetInput.bind(this);
    }

    _resetMap = () => {
        let mapping = [];
        for (let i = SiteSettingsSeoConstants.NB_NEW_MAPPING_ROWS; i >= 0; i--) {
            mapping.push({language: this.defaultLanguage, defaultMapping: false, active: true, focus: false})
        }
        return mapping;
    };

    handleSave = (event) => {
        let {vanityMutationsContext, notificationContext, path, t} = this.props;

        // exit if there is no mapping to save
        if (this.state.mappings.length === 0) {
            this.handleClose(event);
            return;
        }

        let mappings = _.map(_.filter(this.state.mappings, (entry) => entry.url), (entry) => {
            delete entry.focus;
            return entry;
        });

        try {
            vanityMutationsContext.add(path, mappings, this.props).then((result) => {
                if (this.state.doPublish) {
                    vanityMutationsContext.publish(result.data.jcr.modifiedNodes.map(entry => entry.uuid)).then((result) => {
                        this.handleClose(event);
                        notificationContext.notify(t('label.notifications.newMappingCreatedAndPublished'));
                    }, (error) => {
                        notificationContext.notify(t('label.errors.Error'));
                        console.log(error)
                    })
                } else {
                    this.handleClose(event);
                    notificationContext.notify(t('label.notifications.newMappingCreated'));
                }
            }, (error) => {
                if (error.graphQLErrors && error.graphQLErrors[0].extensions) {
                    this.setState({
                        errors: _.map(error.graphQLErrors[0].extensions, (value) => {
                            return {
                                url: value.urlMapping,
                                message: t("label.errors.GqlConstraintViolationException_message", {existingNodePath: value.existingNodePath}),
                                label: t("label.errors.GqlConstraintViolationException")
                            }
                        })
                    });
                } else {
                    notificationContext.notify(t('label.errors.Error'));
                    console.log(error)
                }
            })
        } catch (e) {
            if (e.errors) {
                this.setState({
                    errors: _.map(e.errors, (error) => {
                        return {
                            url: error.mapping,
                            message: t("label.errors." + error.name + "_message"),
                            label: t("label.errors." + error.name)
                        }
                    })
                });
            } else {
                notificationContext.notify(t("label.errors." + (e.name ? e.name : "Error")));
            }
        }

    };

    handleClose = (event) => {
        this.setState({
            mappings: this._resetMap(),
            errors: [],
            doPublish: false
        });
        this.props.onClose(event);
    };

    handleFieldChange = (field, index, value) => {
        this.setState(function (previous) {

            if ((field === "url")) {
                previous.errors = _.pullAllBy(previous.errors, [{'url': previous.mappings[index].url}], "url");
            }

            let mappingToDisableDefaultFlag;
            if ((field === "defaultMapping" && value === true)) {
                mappingToDisableDefaultFlag = _.find(previous.mappings, mapping => (mapping.defaultMapping && mapping.language === previous.mappings[index].language));
            }

            if ((field === "language" && previous.mappings[index].defaultMapping)) {
                mappingToDisableDefaultFlag = _.find(previous.mappings, mapping => (mapping.defaultMapping && mapping.language === value)) ? previous.mappings[index] : undefined;
            }

            if (mappingToDisableDefaultFlag) {
                mappingToDisableDefaultFlag.defaultMapping = false;
            }

            previous.mappings[index][field] = value;
            if (field === "url" && _.filter(previous.mappings, entry => entry.url).length === previous.mappings.length) {
                previous.mappings.push({
                    language: this.defaultLanguage,
                    defaultMapping: false,
                    active: true,
                    focus: false
                });
            }
            return {mappings: previous.mappings, errors: previous.errors};

        });
    };

    handlePublishCheckboxChange = (checked) => {
        this.setState({
            doPublish: checked
        })
    };

    handleDialogEntered = () => {
        this.firstMappingInputRef.focus()
    };

    inputTab = [];

    resetInput = (input) => {
        console.log("reset input");
        input.value = "";
        input.focus();
    }

    render() {
        let {t, open, path, onClose, availableLanguages, classes} = this.props;
        const {errors, mappings} = this.state;

        return (
            <Dialog open={open} onClose={onClose} maxWidth={'md'} fullWidth={true}
                    onEntered={this.handleDialogEntered}>
                <DialogTitle id="alert-dialog-title">{t('label.dialogs.add.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {path}
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <Grid container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                        <Grid item xs={12}>
                            {mappings.map((entry, index) => {
                                let errorForRow = _.find(errors, error => error.url === entry.url || error.url === ('/' + entry.url));
                                return (
                                    <Paper key={index} elevation={1} square={true}>
                                        <Grid container spacing={0} direction={'row'} justify={'space-between'} alignItems={'center'}>
                                            <Grid item xs={9}>
                                                <Grid container spacing={0} direction={'row'} justify={'flex-start'} alignItems={'center'}>
                                                    <Grid item>
                                                        <Switch
                                                            checked={entry.active}
                                                            onChange={(event, checked) => this.handleFieldChange("active", index, checked)}
                                                            data-vud-role="active"/>
                                                    </Grid>
                                                    <Grid item xs={10}>
                                                        <FormControl className={classes.formControl}>
                                                            <Input
                                                                ref={index}
                                                                inputRef={(input) => {
                                                                    this.inputTab[index] = input;
                                                                    if (index === 0) {
                                                                        this.firstMappingInputRef = input
                                                                    }
                                                                }}
                                                                error={!!errorForRow}
                                                                placeholder={t("label.dialogs.add.text")}
                                                                onFocus={() => this.handleFieldChange("focus", index, true)}
                                                                onBlur={() => this.handleFieldChange("focus", index, false)}
                                                                onChange={(event) => this.handleFieldChange("url", index, event.target.value)}
                                                                data-vud-role="url"
                                                                endAdornment={entry.url &&
                                                                <InputAdornment position={'end'}>
                                                                    <IconButton className={classes.button + " " + classes.cancel}
                                                                                component="span" disableRipple onClick={() => {
                                                                        delete entry.url;
                                                                        this.resetInput(this.inputTab[index])
                                                                    }}>
                                                                        <Cancel/>
                                                                    </IconButton>
                                                                </InputAdornment>
                                                                }
                                                            />
                                                            {errorForRow && <Tooltip title={errorForRow.message}>
                                                                <FormHelperText error={true}>
                                                                    {errorForRow.label}
                                                                </FormHelperText>
                                                            </Tooltip>}
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Grid container spacing={0} direction={'row'} justify={'flex-end'} alignItems={'center'}>
                                                    <Grid item>
                                                        <Checkbox checked={entry.defaultMapping}
                                                                  icon={<StarBorder/>}
                                                                  checkedIcon={<Star/>}
                                                                  onChange={(event, checked) => this.handleFieldChange("defaultMapping", index, checked)}
                                                                  data-vud-role="default"/>
                                                    </Grid>
                                                    <Grid item>
                                                        <LanguageMenu languages={availableLanguages}
                                                                      languageCode={entry.language}
                                                                      onLanguageSelected={(languageCode) => this.handleFieldChange("language", index, languageCode)}/>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                )
                            })}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container direction={'row'} spacing={0} justify={'space-between'} alignItems={'center'}>
                        <Grid item>
                            <FormControlLabel control={
                                                  <Checkbox
                                                      onChange={(event, checked) => this.handlePublishCheckboxChange(checked)}
                                                      data-vud-role="checkbox-hint"/>
                                              }
                                              label={t('label.dialogs.add.check')}
                            />
                        </Grid>
                        <Grid item>
                            <Button onClick={this.handleClose} color="default" data-vud-role="button-cancel">
                                {t('label.cancel')}
                            </Button>
                            <Button onClick={this.handleSave} color="secondary" autoFocus
                                    data-vud-role="button-primary">
                                {t('label.dialogs.add.save')}
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        )
    }
}

AddVanityUrl = compose(
    withVanityMutationContext(),
    withNotifications(),
    withStyles(styles),
    translate()
)(AddVanityUrl);

export default AddVanityUrl;
