import React from 'react';
import {
    Checkbox,
    Input,
    Button,
    Paper,
    Popover,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    withStyles,
} from 'material-ui';
import {Add, Star, StarBorder, Info} from 'material-ui-icons';
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
    paper: {
        padding: theme.spacing.unit,
    },
    popover: {
        pointerEvents: 'none',
    },
    leftControl: {
        marginRight: "auto",
        paddingLeft: "16px"
    },
    rowDisabled: {
        backgroundColor: theme.palette.background.global,
        color: theme.palette.getContrastText(theme.palette.background.global),
    }
});

class AddVanityUrl extends React.Component {

    constructor(props) {
        super(props);
        // get default language for the language selector
        this.defaultLanguage = this.props.defaultLanguage;

        this.state = {
            newMappings: this._resetMap(),
            errors:[],
            errorPopover: null,
            doPublish: false
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handlePublishCheckboxChange = this.handlePublishCheckboxChange.bind(this);
        this.handleErrorPopoverOpen = this.handleErrorPopoverOpen.bind(this);
        this.handleErrorPopoverClose = this.handleErrorPopoverClose.bind(this);
    }

    _resetMap = () => {
        let newMappings = [];
        for (let i = SiteSettingsSeoConstants.NB_NEW_MAPPING_ROWS; i >= 0; i--) {
            newMappings.push({language: this.defaultLanguage, defaultMapping: false, active: true, focus: false})
        }
        return newMappings;
    };

    handleErrorPopoverOpen = (event, message) => {
        this.setState({ errorPopover: {anchorEl: event.target, message: message} });
    };

    handleErrorPopoverClose = () => {
        this.setState({ errorPopover: null });
    };

    handleSave = (event) => {
        let { vanityMutationsContext, notificationContext, path, t} = this.props;
        let newMappings = _.map(_.filter(this.state.newMappings,(entry) =>  entry.url), (entry) => {
            delete entry.focus;
            return entry;
        });
        try {
            vanityMutationsContext.add(path, newMappings).then((result) =>
            {
                if (this.state.doPublish) {
                    vanityMutationsContext.publish(result.data.jcr.modifiedNodes.map(entry => entry.uuid)).then((result) => {
                        this.handleClose(event);
                        notificationContext.notify(t('label.newMappingCreatedAndPublished'));
                    }, (error) => {
                        notificationContext.notify(t('label.errors.Error'));
                        console.log(error)
                    })
                } else {
                    this.handleClose(event);
                    notificationContext.notify(t('label.newMappingCreated'));
                }
            }, (error) => {
                if (error.graphQLErrors && error.graphQLErrors[0].extensions) {
                    this.setState({
                        errors: _.map(error.graphQLErrors[0].extensions, (value) => {
                            return {
                                url: value.urlMapping,
                                message: t("label.dialogs.add.error.exists", {contentPath: value.existingNodePath})
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
                            message: t("label.dialogs.add.error.invalid")
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
            newMappings: this._resetMap(),
            errors:[],
            errorPopoverAnchorEl: null,
            doPublish: false
        });
        this.props.onClose(event);
    };

    handleFieldChange = (field, index, value) => {
        this.setState(function (previous) {

            let mappingToDisableDefaultFlag;
            if ((field === "defaultMapping" && value === true)) {
                mappingToDisableDefaultFlag = _.find(previous.newMappings, mapping =>  (mapping.defaultMapping && mapping.language === previous.newMappings[index].language));
            }

            if ((field === "language" && previous.newMappings[index].defaultMapping)) {
                mappingToDisableDefaultFlag = _.find(previous.newMappings, mapping =>  (mapping.defaultMapping && mapping.language === value)) ? previous.newMappings[index] : undefined;
            }

            if (mappingToDisableDefaultFlag) {
                mappingToDisableDefaultFlag.defaultMapping = false;
            }

            previous.newMappings[index][field] = value;
            if (field === "url" && _.filter(previous.newMappings, entry => entry.url).length === previous.newMappings.length) {
                previous.newMappings.push({ language: this.defaultLanguage, defaultMapping: false, active: true, focus: false });
            }
            return {newMappings: previous.newMappings};

        });
    };

    handlePublishCheckboxChange = (checked) => {
        this.setState({
            doPublish: checked
        })
    };

    render() {
        let { t, open, path, onClose, availableLanguages, classes } = this.props;
        const { errors, newMappings, errorPopover } = this.state;

        return (
            <div>
                <Dialog open={open} onClose={onClose} maxWidth={'md'} fullWidth={true}>
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
                                    {newMappings.map((entry, index) => {
                                        let errorForRow = _.find(errors, error =>  error.url === entry.url);
                                        let lineEnabled = !!entry.url || entry.focus;
                                        return (
                                            <TableRow key={index} classes={{
                                                root: (lineEnabled ? '' : classes.rowDisabled)
                                            }}>
                                                <TableCell padding={'none'}>
                                                    <Switch
                                                        checked={entry.active}
                                                        onChange={(event, checked) => this.handleFieldChange("active", index, checked)}/>
                                                </TableCell>
                                                <TableCell padding={'none'}>
                                                    <Input
                                                        error={ !!errorForRow }
                                                        placeholder={t("label.dialogs.add.text")}
                                                        onFocus={() => this.handleFieldChange("focus", index, true)}
                                                        onBlur={() => this.handleFieldChange("focus", index, false)}
                                                        onChange={(event) => this.handleFieldChange("url", index, event.target.value)}
                                                    />

                                                </TableCell>
                                                <TableCell padding={'none'}>
                                                    { errorForRow ?
                                                        (
                                                            <Info color="error" className={classes.error} aria-label="error"
                                                                  onMouseOver={(event) => this.handleErrorPopoverOpen(event, errorForRow.message)}
                                                                  onMouseOut={this.handleErrorPopoverClose} />)
                                                        : ""
                                                    }
                                                </TableCell>
                                                <TableCell padding={'none'}>
                                                    <Checkbox checked={entry.defaultMapping}
                                                              icon={<StarBorder/>}
                                                              checkedIcon={<Star/>}
                                                              onChange={(event, checked) => this.handleFieldChange("defaultMapping", index, checked)}/>
                                                </TableCell>
                                                <TableCell padding={'none'}>
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
                                              <Checkbox onChange={(event, checked) => this.handlePublishCheckboxChange(checked)} />
                                          }
                                          label={t('label.dialogs.add.check')}
                        />
                        <Button onClick={this.handleClose} color="primary">
                            {t('label.cancel')}
                        </Button>
                        <Button onClick={this.handleSave} color="primary" autoFocus>
                            {t('label.dialogs.add.save')}
                        </Button>
                    </DialogActions>
                </Dialog>

                { errorPopover ?
                    (
                        <Popover
                            className={classes.popover}
                            classes={{ paper: classes.paper }}
                            open={true}
                            anchorEl={errorPopover.anchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                            onClose={this.handleErrorPopoverClose}
                        >
                            <Typography>{errorPopover.message}</Typography>
                        </Popover>)
                    : ""
                }
            </div>
        )
    }
}

AddVanityUrl = compose(
    withVanityMutationContext(),
    withNotifications(),
    withStyles(styles),
    translate('site-settings-seo')
)(AddVanityUrl);

export default AddVanityUrl;