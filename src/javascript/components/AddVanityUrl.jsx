import React from 'react';
import {
    Checkbox,
    Input,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    withStyles,
} from 'material-ui';
import {Add, Star, StarBorder, Info, Cancel} from 'material-ui-icons';
import {LanguageMenu} from "./LanguageMenu";
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import { FormControlLabel } from 'material-ui/Form';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {withVanityMutationContext} from "./VanityMutationsProvider";
import {withNotifications} from '@jahia/react-dxcomponents';
import * as _ from 'lodash';
import {SiteSettingsSeoConstants} from "./SiteSettingsSeo";

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    inactive: {
        color: theme.palette.text.disabled
    },
    error: {
        color: theme.palette.error.main
    },
    leftControl: {
        marginRight: "auto",
        paddingLeft: "16px"
    },
    rowDisabled: {
        backgroundColor: theme.palette.background.global,
        color: theme.palette.getContrastText(theme.palette.background.global),
    },
    root:{
        width:"100%",
        "& error": {
        },
        "& message": {
            display:"none"
        },
        "& label": {
        }
    },
    button: {
        height: 18,
        width: 18,
        position: "absolute",
        top: 4,
        transform: "scale(0.75)",
        "&:hover": {
            backgroundColor: "inherit"
        }
    },
    cancel: {
        color: theme.palette.primary.main,
        right: 0
    }
});

class AddVanityUrl extends React.Component {

    constructor(props) {
        super(props);
        // get default language for the language selector
        this.defaultLanguage = this.props.lang;

        this.state = {
            mappings: this._resetMap(),
            errors:[],
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
        let { vanityMutationsContext, notificationContext, path, t} = this.props;
        let mappings= _.map(_.filter(this.state.mappings,(entry) =>  entry.url), (entry) => {
            delete entry.focus;
            return entry;
        });
        // check for duplicate mapping
        let error = false;
        _.each(mappings, entry => {
            if (_.filter(mappings, value => value.url === entry.url).length > 1 ) {
                this.setState(previous => {
                    previous.errors.push({
                        url: entry.url,
                        message: this.props.t("label.errors.duplicateMappings_message"),
                        label: this.props.t("label.errors.duplicateMappings")
                    });
                    return {
                        errors: previous.errors
                    }
                });
                error = true;
            }
        });
        if (error) {
            return;
        }


        // exit if there is no mapping to save
        if (mappings.length === 0) {
            this.handleClose(event);
            return;
        }
        try {
            vanityMutationsContext.add(path, mappings, this.props).then((result) =>
            {
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
            if (e.invalidMappings) {
                this.setState({
                    errors: _.map(e.invalidMappings, (invalidMapping) => {
                        return {
                            url: invalidMapping,
                            message: t("label.errors.InvalidMappingError_message"),
                            label: t("label.errors.InvalidMappingError")
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
            errors:[],
            doPublish: false
        });
        this.props.onClose(event);
    };

    handleFieldChange = (field, index, value) => {
        this.setState(function (previous) {

            let mappingToDisableDefaultFlag;
            let errors = previous.errors;
            let mappings = previous.mappings;

            if (field === "focus") {
                errors = _.filter(errors, entry => entry.url !== mappings[index].url);
            }

            if (field === "defaultMapping" && value === true) {
                mappingToDisableDefaultFlag = _.find(mappings, entry =>  (entry.defaultMapping && entry.language === entry[index].language));
            }

            if (field === "language" && mappings[index].defaultMapping) {
                mappingToDisableDefaultFlag = _.find(mappings, entry =>  (entry.defaultMapping && entry.language === value)) ? entry[index] : undefined;
            }

            if (mappingToDisableDefaultFlag) {
                mappingToDisableDefaultFlag.defaultMapping = false;
            }

            previous.mappings[index][field] = value;
            if (field === "url" && _.filter(previous.mappings, entry => entry.url).length === previous.mappings.length) {
                previous.mappings.push({ language: this.defaultLanguage, defaultmapping: false, active: true, focus: false });
            }
            mappings[index][field] = value;

            return {mappings: mappings, errors: errors};

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
        let { t, open, path, onClose, availableLanguages, classes } = this.props;
        const { errors, mappings } = this.state;

        return (
            <div>
                <Dialog open={open} onClose={onClose} maxWidth={'md'} fullWidth={true} onEntered={this.handleDialogEntered}>
                    <DialogTitle id="alert-dialog-title">{t('label.dialogs.add.title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {path}
                        </DialogContentText>
                    </DialogContent>
                    <DialogContent>
                        <Paper elevation={2}>
                            <Table>
                                <TableBody>
                                    {mappings.map((entry, index) => {
                                        let errorForRow = _.find(errors, error =>  error.url === entry.url || error.url === ('/' + entry.url));
                                        let lineEnabled = !!entry.url || entry.focus;
                                        return (
                                            <TableRow key={index} classes={{
                                                root: (lineEnabled ? '' : classes.rowDisabled)
                                            }}>
                                                <TableCell padding={'none'}>
                                                    <Switch
                                                        checked={entry.active}
                                                        onChange={(event, checked) => this.handleFieldChange("active", index, checked)}
                                                        data-vud-role="active"/>
                                                </TableCell>
                                                <TableCell padding={'none'}>

                                                    <FormControl className={classes.root} >
                                                        <Input
                                                            ref={index}
                                                            inputRef={(input) => {this.inputTab[index] = input; if(index === 0) {this.firstMappingInputRef = input}}}
                                                            error={ !!errorForRow }
                                                            placeholder={t("label.dialogs.add.text")}
                                                            onFocus={() => this.handleFieldChange("focus", index, true)}
                                                            onBlur={() => this.handleFieldChange("focus", index, false)}
                                                            onChange={(event) => this.handleFieldChange("url", index, event.target.value)}
                                                            data-vud-role="url"
                                                        />
                                                        { errorForRow && <FormHelperText><error><label>{errorForRow.label}</label><message>{errorForRow.message}</message></error></FormHelperText> }
                                                        {entry.url &&
                                                        <IconButton className={classes.button + " " + classes.cancel}
                                                                    component="span" disableRipple onClick={() => {
                                                            delete entry.url;
                                                            this.resetInput(this.inputTab[index])
                                                        }}>
                                                            <Cancel/>
                                                        </IconButton>
                                                        }
                                                    </FormControl>

                                                </TableCell>
                                                <TableCell padding={'none'}>
                                                    <Checkbox checked={entry.defaultMapping}
                                                              icon={<StarBorder/>}
                                                              checkedIcon={<Star/>}
                                                              onChange={(event, checked) => this.handleFieldChange("defaultMapping", index, checked)}
                                                              data-vud-role="default"/>
                                                </TableCell>
                                                <TableCell padding={'none'} data-vud-role="language">
                                                    <LanguageMenu languages={availableLanguages}
                                                                  languageCode={ entry.language }
                                                                  onLanguageSelected={(languageCode) => this.handleFieldChange("language", index, languageCode)}/>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <FormControlLabel classes={{ root: classes.leftControl }}
                                          control={
                                              <Checkbox onChange={(event, checked) => this.handlePublishCheckboxChange(checked)} data-vud-role="checkbox-hint" />
                                          }
                                          label={t('label.dialogs.add.check')}
                        />
                        <Button onClick={this.handleClose} color="primary" data-vud-role="button-cancel">
                            {t('label.cancel')}
                        </Button>
                        <Button onClick={this.handleSave} color="primary" autoFocus data-vud-role="button-primary">
                            {t('label.dialogs.add.save')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
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