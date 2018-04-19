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
});

class AddVanityUrl extends React.Component {

    constructor(props) {
        super(props);
        // get default language for the language selector
        this.defaultLanguage = this.props.defaultLanguage;

        this.state = {
            newMappings: this._resetMap(),
            errors:[],
            errorPopoverAnchorEl: null,
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
            newMappings.push({language: this.defaultLanguage, defaultMapping: false})
        }
        return newMappings;
    };

    handleErrorPopoverOpen = event => {
        this.setState({ errorPopoverAnchorEl: event.target });
    };

    handleErrorPopoverClose = () => {
        this.setState({ errorPopoverAnchorEl: null });
    };

    handleSave = (event) => {
        let { vanityMutationsContext, notificationContext, path, t} = this.props;
        vanityMutationsContext.add(path, _.filter(this.state.newMappings,(entry) =>  entry.url)).then((result) =>
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
            if (error.graphQLErrors) {
                this.setState(
                    { errors: _.map(error.graphQLErrors[0].extensions, (value) => value) }
                )
            } else {
                notificationContext.notify(t('label.errors.Error'));
                console.log(error)
            }

        })
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
            previous.newMappings[index][field] = value;
            if (field === "url" && _.filter(previous.newMappings, entry => entry.url).length === previous.newMappings.length) {
                previous.newMappings.push({ language: this.defaultLanguage, defaultMapping: false });
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
        const { errors, newMappings, errorPopoverAnchorEl } = this.state;

        return (
            <Dialog open={open} onClose={onClose} maxWidth={'md'} fullWidth={true}>
                <DialogTitle id="label.dialogs.add.title"  onClick={(event) => {event.stopPropagation()}}><Typography>{t('label.dialogs.add.title')}</Typography></DialogTitle>
                <DialogContent  onClick={(event) => {event.stopPropagation()}}>
                    <DialogContentText id="label.dialogs.add.content" >
                        {path}
                    </DialogContentText>
                </DialogContent>
                <DialogContent  onClick={(event) => {event.stopPropagation()}}>
                    <Paper elevation={2}>
                        <Table>
                            <TableBody>
                                {newMappings.map((entry, index) => {
                                    let errorForRow = _.find(errors, error =>  error.urlMapping === entry.url);
                                    return (
                                        <TableRow key={index}>
                                            <TableCell padding={'none'}>
                                                <Switch
                                                    onClick={(event) => {event.stopPropagation()}}
                                                    onChange={(event, checked) => this.handleFieldChange("active", index, checked)}/>
                                            </TableCell>
                                            <TableCell padding={'none'} onClick={(event) => {event.stopPropagation()}}>
                                                <Input
                                                    error={ !!errorForRow }
                                                    placeholder={t("label.dialogs.add.text")}
                                                    onClick={(event) => {event.stopPropagation()}}
                                                    onChange={(event) => this.handleFieldChange("url", index, event.target.value)}
                                                />

                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                { errorForRow ?
                                                    (
                                                        <div>
                                                            <Info color="error" className={classes.error} aria-label="error"
                                                                  onMouseOver={this.handleErrorPopoverOpen}
                                                                  onMouseOut={this.handleErrorPopoverClose} />

                                                            <Popover
                                                                className={classes.popover}
                                                                classes={{ paper: classes.paper }}
                                                                open={!!errorPopoverAnchorEl}
                                                                anchorEl={errorPopoverAnchorEl}
                                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                                                                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                                                                onClose={this.handleErrorPopoverClose}
                                                            >
                                                                <Typography>{t("label.dialogs.add.error.exists", {contentPath: errorForRow.existingNodePath})}</Typography>
                                                            </Popover>
                                                        </div>)
                                                    : ""
                                                }
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                <Checkbox icon={<StarBorder/>} checkedIcon={<Star/>}
                                                          onClick={(event) => {event.stopPropagation()}}
                                                          onChange={(event, checked) => this.handleFieldChange("defaultMapping", index, checked)}/>
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                <LanguageMenu onClick={(event) => {event.stopPropagation()}}
                                                              languages={availableLanguages}
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
                    <FormControlLabel
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