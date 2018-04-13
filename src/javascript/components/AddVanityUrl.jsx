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
        this.state = {
            openDialog: false,
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen = (event) => {
        this.setState({openDialog: true});
        event.stopPropagation();
    };

    handleClose = (event) => {
        this.setState({openDialog: false});
        event.stopPropagation();
    };

    render() { return (
        <div>
            <IconButton onClick={this.handleOpen}>
                <Add />
            </IconButton>
            <AddVanityUrlDialog open={this.state.openDialog} close={this.handleClose} languages={this.props.languages} path={this.props.path}/>
        </div>
    )}
};

class AddVanityUrlDialog extends React.Component {

    constructor(props) {
        super(props);
        // fill new mappings
        let newMappings = [];
        for (let i = 4; i >= 0; i--) {
            newMappings.push({index: i, language: "en", default: false})
        }
        this.state = {
            newMappings: this._resetMap()
        };
        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);

    }

    _resetMap = () => {
        let newMappings = [];
        for (let i = 4; i >= 0; i--) {
            newMappings.push({index: i, language: "en", default: false})
        }
        return newMappings;
    }

    handleClickSave = (event) => {
        let { vanityMutationsContext, notificationContext, path, t} = this.props;
        this.state.newMappings.forEach((newMapping) => {
            if (newMapping.url) {
                vanityMutationsContext.add(path, newMapping.default, newMapping.active, newMapping.language, newMapping.url);
            }
        });
        this.setState({
            newMappings: this._resetMap()
        });
        this.props.close(event);
        notificationContext.notify(t('label.newMappingCreated'));
    };

    handleClickCancel = (event) => {
        this.setState({
            newMappings: this._resetMap()
        });
        this.props.close(event);
    };

    handleFieldChange = (field, index, value) => {
        this.setState(function (previous) {
            let prev = _.remove(previous.newMappings, {index: index})[0];
            let merged = _.merge(prev, JSON.parse('{"index": ' + index  +',"' + field + '": "' + value + '"}'));
            previous.newMappings.push(merged);
            return {newMappings: previous.newMappings};
        });
    };

    render() {
        const { t, open, close, classes, path } = this.props;
        // sort arrat by index
        let newMappings = _.sortBy(this.state.newMappings, ['index']);
        return (
            <Dialog open={open} onClose={close} maxWidth={'md'} fullWidth={true}>
                <DialogTitle id="label.dialogs.vanity.add.title">{t('label.dialogs.vanity.add.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="label.dialogs.vanity.add.content">
                        {path}
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
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
                                                placeholder={t("label.dialogs.vanity.add.text")}
                                                onClick={(event) => {event.stopPropagation()}}
                                                onChange={(event) => this.handleFieldChange("url", entry.index, event.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell padding={'none'}>
                                            <Checkbox icon={<StarBorder/>} checkedIcon={<Star/>}
                                                      onClick={(event) => {event.stopPropagation()}}
                                                      onChange={(event, checked) => this.handleFieldChange("default", entry.index, checked)}/>
                                        </TableCell>
                                        <TableCell padding={'none'}>
                                            <LanguageMenu onClick={(event) => {event.stopPropagation()}}
                                                          languages={this.props.languages}
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
                        label={t('label.dialogs.vanity.add.check')}
                    />
                    <Button onClick={this.handleClickCancel} color="primary">
                        {t('label.dialogs.vanity.add.cancel')}
                    </Button>
                    <Button onClick={this.handleClickSave} color="primary" autoFocus>
                        {t('label.dialogs.vanity.add.save')}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}


AddVanityUrl = compose(
    withStyles(styles),
    translate('site-settings-seo')
)(AddVanityUrl);

AddVanityUrlDialog = compose(
    withVanityMutationContext(),
    withNotifications(),
    withStyles(styles),
    translate('site-settings-seo')
)(AddVanityUrlDialog);

export {AddVanityUrl}