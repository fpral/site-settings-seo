import React from 'react';
import {
    Checkbox,
    Input,
    Button,
    IconButton,
    Icon,
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
            anchorEl: null,
            popperOpen: false
        };

        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);

    }

    handlePopoverOpen = event => {
        this.setState({ anchorEl: event.target });
    };

    handlePopoverClose = () => {
        this.setState({ anchorEl: null });
    };

    _resetMap = () => {
        let newMappings = [];
        for (let i = SiteSettingsSeoConstants.NB_NEW_MAPPING_ROWS; i >= 0; i--) {
            newMappings.push({language: this.defaultLanguage, defaultMapping: false})
        }
        return newMappings;
    };

    handleClickSave = (event) => {
        let { vanityMutationsContext, notificationContext, path, t} = this.props;
        vanityMutationsContext.add(path, _.filter(this.state.newMappings,(entry) =>  entry.url)).then((result) =>
        {
            this.setState({
                newMappings: this._resetMap(),
                errors: []
            });
            this.props.onClose(event);
            notificationContext.notify(t('label.newMappingCreated'));
        }, (error) => {
            let errors = [];
            _.map(error.graphQLErrors[0].extensions, (value) => errors.push(value))
            this.setState(
                {errors: errors}
            )
        })
    };

    handleClickCancel = (event) => {
        this.setState({
            newMappings: this._resetMap()
        });
        this.props.onClose(event);
    };

    handleFieldChange = (field, index, value) => {
        this.setState(function (previous) {
            previous.newMappings[index][field] = value;
            if (field == "url" && _.filter(previous.newMappings, entry => entry.url).length == previous.newMappings.length) {
                let newKey = previous.newMappings.length + 1;
                previous.newMappings.push({ language: this.defaultLanguage, defaultMapping: false });
            }
            return {newMappings: previous.newMappings};

        });
    };

    render() {
        let { t, open, path, onClose, availableLanguages, classes } = this.props;
        const { errors, newMappings, anchorEl } = this.state;
        const openPP = !!anchorEl;
        // sort arrat by index
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
                                    const error = _.filter(errors, error =>  error.urlMapping == entry.url).length > 0;
                                    let errorPath = "";
                                    if (error) {
                                        errorPath = _.filter(errors, error =>  error.urlMapping == entry.url)[0].existingNodePath;
                                    }
                                    return (
                                        <TableRow key={index}>
                                            <TableCell padding={'none'}>
                                                <Switch
                                                    onClick={(event) => {event.stopPropagation()}}
                                                    onChange={(event, checked) => this.handleFieldChange("active", index, checked)}/>
                                            </TableCell>
                                            <TableCell padding={'none'} onClick={(event) => {event.stopPropagation()}}>
                                                <Input
                                                    error={ error }
                                                    placeholder={t("label.dialogs.add.text")}
                                                    onClick={(event) => {event.stopPropagation()}}
                                                    onChange={(event) => this.handleFieldChange("url", index, event.target.value)}
                                                />

                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                { error ?
                                                    (   <div>
                                                        <Info color="error" className={classes.error} aria-label="error"
                                                              onMouseOver={error ? this.handlePopoverOpen : null}
                                                              onMouseOut={error ? this.handlePopoverClose : null}>
                                                        </Info>

                                                        <Popover
                                                            className={classes.popover}
                                                            classes={{
                                                                paper: classes.paper,
                                                            }}
                                                            open={openPP}
                                                            anchorEl={anchorEl}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'left',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'left',
                                                            }}
                                                            onClose={this.handlePopoverClose}
                                                        >
                                                            <Typography>{t("label.dialogs.add.error.exists", {contentPath: errorPath})}</Typography>
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
                            <Checkbox
                                onClick={(event) => {event.stopPropagation()}}
                                checked=""
                                onChange=""
                                value="checkedB"
                                color="primary"
                            />
                        }
                        label={t('label.dialogs.add.check')}
                    />
                    <Button onClick={this.handleClickCancel} color="primary">
                        {t('label.dialogs.add.cancel')}
                    </Button>
                    <Button onClick={this.handleClickSave} color="primary" autoFocus>
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