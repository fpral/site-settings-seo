import React from 'react';
import * as _ from "lodash";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    Grid
} from '@material-ui/core';
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import {withNotifications} from '@jahia/react-material';
import {withVanityMutationContext} from "./VanityMutationsProvider";

class Deletion extends React.Component {

    constructor(props) {
        super(props);

        let { vanityMutationsContext, notificationContext, t } = this.props;
        this.delete = function() {
            vanityMutationsContext.delete(_.map(this.props.urlPairs, "uuid"), this.props);
            props.onClose();
            notificationContext.notify(t('label.notifications.deletionConfirmed'));
        };
        this.state = {
            deleteDisabled: true,
        };
       this.handleDeleteDisabled = this.handleDeleteDisabled.bind(this);
       this.handleClose = this.handleClose.bind(this);
    }

    handleDeleteDisabled() {
        this.setState((previous) => ({deleteDisabled: !previous.deleteDisabled}));
    }

    handleClose() {
        this.setState({
            deleteDisabled: true
        });
        this.props.onClose()
    }

    render() {
        const { open, onClose, t, urlPairs } = this.props;
        let mappingCount = urlPairs.length;
        return (
            <Dialog open={open} fullWidth={true} onClose={onClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description" data-vud-role="dialog">
                <DialogTitle id="alert-dialog-title">{t('label.dialogs.delete.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-headline" gutterBottom>
                        {t('label.dialogs.delete.headline', {count: mappingCount})}
                    </DialogContentText>
                    <Table>
                        <TableBody>
                            {urlPairs.map((url, i) =>
                                <TableRow key={i} hover>
                                    <TableCell>
                                        <Typography color={'secondary'}>{url.default.url}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography color={'primary'}>{url.default.language}</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <br />
                    <DialogContentText id="alert-dialog-content" gutterBottom>
                          {t('label.dialogs.delete.content')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Grid container direction={'row'} spacing={0} justify={'space-between'} alignItems={'center'}>
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={!this.state.deleteDisabled}
                                              onChange={() => this.handleDeleteDisabled()}
                                              data-vud-role="checkbox-hint" />
                                }
                                label={t("label.dialogs.delete.terms")}
                            />
                        </Grid>
                        <Grid item>
                            <Button onClick={this.handleClose} color="default" data-vud-role="button-cancel">
                                {t('label.cancel')}
                            </Button>
                            <Button onClick={() => {this.delete()}} color="secondary" autoFocus disabled={this.state.deleteDisabled} data-vud-role="button-primary">
                                {t('label.dialogs.delete.delete')}
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        );
    }
}

Deletion = compose(
    withVanityMutationContext(),
    withNotifications(),
    translate()
)(Deletion);

export default Deletion;
