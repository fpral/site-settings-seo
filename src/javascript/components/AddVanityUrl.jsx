import React from 'react';
import {
    Checkbox,
    IconButton,
    Input,
    Button,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableRow,
    withStyles
} from 'material-ui';
import {Add, Star, StarBorder} from 'material-ui-icons';
import {LanguageMenu} from "./LanguageMenu";
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import { FormControlLabel } from 'material-ui/Form';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {withVanityMutationContext} from "./VanityMutationsProvider";
import {withNotifications} from '@jahia/react-dxcomponents';
import * as _ from 'lodash';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    inactive: {
        color: theme.palette.text.disabled
    },
});

class AddVanityUrl extends React.Component {

    constructor(props) {
        super(props);
        // get default language for the language selector
        this.defaultLanguage = this.props.defaultLanguage;
        this.defaultRowsDiplayed = 5;

        this.state = {
            newMappings: this._resetMap()
        };

        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);

    }

    _resetMap = () => {
        let newMappings = [];
        for (let i = this.defaultRowsDiplayed; i >= 0; i--) {
            newMappings.push({index: i, language: this.defaultLanguage, defaultMapping: false})
        }
        return newMappings;
    }

    handleClickSave = (event) => {
        let { vanityMutationsContext, notificationContext, path, t} = this.props;
        vanityMutationsContext.add(path,_.map(_.filter(this.state.newMappings, 'url'), function(entry) { delete entry['index']; return entry}), this.props);
        this.setState({
            newMappings: this._resetMap()
        });
        this.props.onClose(event);
        notificationContext.notify(t('label.newMappingCreated'));
    };

    handleClickCancel = (event) => {
        this.setState({
            newMappings: this._resetMap()
        });
        this.props.onClose(event);
    };

    handleFieldChange = (field, index, value) => {
        this.setState(function (previous) {
            let prev = _.remove(previous.newMappings, {index: index})[0];
            let newFieldJSON = {index: index};
            newFieldJSON[field] = value;
            let merged = _.merge(prev, newFieldJSON);
            previous.newMappings.push(merged);
            if (field == "url" && _.filter(previous.newMappings, 'url').length == previous.newMappings.length) {
                previous.newMappings.push({index: previous.newMappings.length + 1, language: this.defaultLanguage, defaultMapping: false})
            }
            return {newMappings: previous.newMappings};

        });
    };

    render() {
        let { t, open, path, onClose, availableLanguages } = this.props;
        // sort arrat by index
        let newMappings = _.sortBy(this.state.newMappings, ['index']);
        return (
            <Dialog open={open} onClose={onClose} maxWidth={'md'} fullWidth={true}>
                <DialogTitle id="label.dialogs.add.title"  onClick={(event) => {event.stopPropagation()}}>{t('label.dialogs.add.title')}</DialogTitle>
                <DialogContent  onClick={(event) => {event.stopPropagation()}}>
                    <DialogContentText id="label.dialogs.add.content" >
                        {path}
                    </DialogContentText>
                </DialogContent>
                <DialogContent  onClick={(event) => {event.stopPropagation()}}>
                    <Paper elevation={2}>
                        <Table>
                            <TableBody>
                                {newMappings.map((entry) => (
                                    <TableRow key={entry.index}>
                                        <TableCell padding={'none'}>
                                            <Switch
                                                onClick={(event) => {event.stopPropagation()}}
                                                onChange={(event, checked) => this.handleFieldChange("active", entry.index, checked)}/>
                                        </TableCell>
                                        <TableCell padding={'none'} onClick={(event) => {event.stopPropagation()}}>
                                            <Input
                                                placeholder={t("label.dialogs.add.text")}
                                                onClick={(event) => {event.stopPropagation()}}
                                                onChange={(event) => this.handleFieldChange("url", entry.index, event.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell padding={'none'}>
                                            <Checkbox icon={<StarBorder/>} checkedIcon={<Star/>}
                                                      onClick={(event) => {event.stopPropagation()}}
                                                      onChange={(event, checked) => this.handleFieldChange("defaultMapping", entry.index, checked)}/>
                                        </TableCell>
                                        <TableCell padding={'none'}>
                                            <LanguageMenu onClick={(event) => {event.stopPropagation()}}
                                                          languages={availableLanguages}
                                                          languageCode={ entry.language }
                                                          onLanguageSelected={(languageCode) => this.handleFieldChange("language", entry.index, languageCode)}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
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