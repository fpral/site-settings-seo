import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import * as _ from "lodash";
import {Button, withStyles} from 'material-ui';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import {Table, TableBody, TableRow, TableCell} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {PublishMutation} from "./gqlMutations";
import {withVanityMutationContext} from "./VanityMutationsProvider";
import {withNotifications} from '@jahia/react-dxcomponents';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

const styles = theme => ({
    deleteClass: {
        color: theme.palette.delete.main
    },
});

class PublishDeletion extends React.Component {

    constructor(props) {
        super(props);
        let { vanityMutationsContext, notificationContext, t } = this.props;

        this.state = {
            deleteButtonState: true,
        };

        this.publish = function() {
            if (this.props.urlPairs.length > 0) {
                vanityMutationsContext.publish(this.props.urlPairs[0].live.parent.uuid, true);
                notificationContext.notify(t('label.notifications.publicationDeletionConfirmed'));
            }
            props.onClose();
        };
    }

    handleDeleteDisabled = () => {
        this.setState((previous) => ({deleteButtonState: !previous.deleteButtonState}));
    };

    handleClose = () => {
        this.setState({
            deleteButtonState: true,
        });
        this.props.onClose()
    };

    render() {
        const { open, classes, onClose, t } = this.props;

        return (
            <div>
                <Dialog open={open} fullWidth={true} onClose={onClose} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description" data-vud-role="dialog">
                    <DialogTitle id="alert-dialog-title">{t('label.dialogs.publishdeletion.title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-headline">
                            {t('label.dialogs.publishdeletion.headline')}{"\n"}
                        </DialogContentText><br/>
                        <DialogContentText id="alert-dialog-content">
                            {t('label.dialogs.publishdeletion.content')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogContent>
                        <Table>
                            <TableBody>
                                {this.props.urlPairs.map((url, i) =>
                                    <TableRow key={i}>
                                        <TableCell className={this.props.classes.deleteClass}>{url.live.url}</TableCell>
                                        <TableCell>{url.live.language}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <FormControlLabel
                            control={
                                <Checkbox data-vud-role="checkbox-hint" />
                            }
                            label={t('label.dialogs.delete.terms')}
                            onChange={this.handleDeleteDisabled}
                            checked={!this.state.deleteButtonState}
                        />
                        <Button onClick={this.handleClose} color="primary" data-vud-role="button-cancel">
                            {t('label.cancel')}
                        </Button>
                        <Button onClick={() => {this.publish()}} color="primary" disabled={this.state.deleteButtonState} autoFocus data-vud-role="button-primary">
                            {t('label.actions.delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

PublishDeletion = compose(
    withVanityMutationContext(),
    withNotifications(),
    (translate()),
    withStyles(styles)
)(PublishDeletion);

export default PublishDeletion;