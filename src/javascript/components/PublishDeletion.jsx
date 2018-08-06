import React from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Grid
} from '@material-ui/core';
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import {withVanityMutationContext} from "./VanityMutationsProvider";
import {withNotifications} from '@jahia/react-material';

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
        const { open, onClose, t, urlPairs } = this.props;
        let mappingCount = urlPairs.length;

        return (
            <Dialog open={open} fullWidth={true} onClose={onClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description" data-vud-role="dialog">
                <DialogTitle id="alert-dialog-title">{t('label.dialogs.publishdeletion.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-headline" gutterBottom>
                        {t('label.dialogs.publishdeletion.headline', {count: mappingCount})}{"\n"}
                    </DialogContentText>
                    <Table>
                        <TableBody>
                            {urlPairs.map((url, i) =>
                                <TableRow key={i} hover>
                                    <TableCell>
                                        <Typography color={'secondary'}>{url.live.url}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography color={'primary'}>{url.live.language}</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <br />
                    {
                        (mappingCount > 1) ?
                            <DialogContentText id="alert-dialog-content" gutterBottom>
                                {t('label.dialogs.publishdeletion.content')}
                            </DialogContentText>
                        : null
                    }
                </DialogContent>
                <DialogActions>
                    <Grid container direction={'row'} spacing={0} justify={'space-between'} alignItems={'center'}>
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox data-vud-role="checkbox-hint" />
                                }
                                label={t('label.dialogs.delete.terms')}
                                onChange={this.handleDeleteDisabled}
                                checked={!this.state.deleteButtonState}
                            />
                        </Grid>
                        <Grid item>
                            <Button onClick={this.handleClose} color="default" data-vud-role="button-cancel">
                                {t('label.cancel')}
                            </Button>
                            <Button onClick={() => {this.publish()}} color="secondary" disabled={this.state.deleteButtonState} autoFocus data-vud-role="button-primary">
                                {t('label.actions.delete')}
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        );
    }
}

PublishDeletion = compose(
    withVanityMutationContext(),
    withNotifications(),
    (translate())
)(PublishDeletion);

export default PublishDeletion;
