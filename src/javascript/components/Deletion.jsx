import React from 'react';
import * as _ from "lodash";
import {Button, Checkbox, FormControlLabel} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {Table, TableBody, TableRow, TableCell} from 'material-ui';
import {withNotifications} from '@jahia/react-dxcomponents';
import {withVanityMutationContext} from "./VanityMutationsProvider";

class Deletion extends React.Component {

    constructor(props) {
        super(props);

        let { vanityMutationsContext, notificationContext, t } = this.props;
        this.delete = function() {
            vanityMutationsContext.delete(_.map(this.props.urlPairs, "uuid"), this.props);
            props.onClose();
            notificationContext.notify(t('label.deletionConfirmed'));
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
        const { open, classes, onClose, t } = this.props;
        return (
            <div>
                <Dialog open={open} fullWidth={true} onClose={onClose} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description" data-vud-role="dialog">
                    <DialogTitle id="alert-dialog-title">{t('label.dialogs.delete.title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-headline">
                            {t('label.dialogs.delete.headline')}
                        </DialogContentText><br/>
                        <DialogContentText id="alert-dialog-content">
                              {t('label.dialogs.delete.content')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogContent>
                        <Table>
                            <TableBody>
                                {this.props.urlPairs.map((url, i) =>
                                    <TableRow key={i}>
                                        <TableCell>{url.default.targetNode.path}</TableCell>
                                        <TableCell>{url.default.url}</TableCell>
                                        <TableCell>{url.default.language}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <span>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={!this.state.deleteDisabled}
                                              onChange={() => this.handleDeleteDisabled()}
                                              data-vud-role="checkbox-hint" />
                                }
                                label={t("label.dialogs.delete.terms")}
                            />
                            <Button onClick={this.handleClose} color="primary">
                                {t('label.cancel')}
                            </Button>
                            <Button onClick={() => {this.delete()}} color="primary" autoFocus disabled={this.state.deleteDisabled} data-vud-role="button-primary">
                                {t('label.delete')}
                            </Button>
                        </span>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Deletion = compose(
    withVanityMutationContext(),
    withNotifications(),
    translate()
)(Deletion);

export default Deletion;