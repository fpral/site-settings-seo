import React from 'react';
import * as _ from "lodash";
import {Button, TextField, Checkbox, FormControlLabel} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {MoveMutation} from "./gqlMutations";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {withNotifications} from '@jahia/react-dxcomponents';

class Move extends React.Component {

    constructor(props) {
        super(props);
        let { moveMutation, notificationContext, t } = this.props;

        this.state = {
            targetPath: '',
            saveDisabled: true,
        };

        this.handleSaveDisabled = this.handleSaveDisabled.bind(this);
        this.handleTargetPathChange = this.handleTargetPathChange.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.move = function() {
            moveMutation({variables: {pathsOrIds: _.map(this.props.urlPairs, "uuid"), target: this.state.targetPath}});
            this.handleClose();
            notificationContext.notify(t("label.moveConfirmed"));
        };
    }

    handleSaveDisabled() {
        this.setState((previous) => ({saveDisabled: !previous.saveDisabled}));
    }

    handleTargetPathChange(event) {
        this.setState({targetPath: event.target.value});
    }

    handleClose() {
        this.setState({
            targetPath: '',
            saveDisabled: true
        });
        this.props.onClose()
    }

    render() {
        const { open, t } = this.props;
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{t("label.dialogs.move.title")}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t("label.dialogs.move.content")}</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="targetPath"
                            label={t("label.dialogs.move.target")}
                            type="text"
                            value={this.state.targetPath} onChange={this.handleTargetPathChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <span>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={!this.state.saveDisabled}
                                              onChange={() => this.handleSaveDisabled()} />
                                }
                                label={t("label.dialogs.move.confirm")}
                            />
                            <Button onClick={this.handleClose} color="primary">{t("label.dialogs.move.cancel")}</Button>
                            <Button onClick={() => {this.move()}} color="primary" disabled={this.state.saveDisabled || this.state.targetPath.length === 0}>{t("label.dialogs.move.move")}</Button>
                        </span>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Move = compose(
    graphql(MoveMutation, {name: 'moveMutation'}),
    withNotifications(),
    (translate('site-settings-seo'))
)(Move);

export default Move;