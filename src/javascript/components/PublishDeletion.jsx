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
	dialogNote: {
		fontSize: '0.875rem',
		marginTop: '30px'
	},
	dialogActionsButtonContainer: {
		display: 'inline-block',
		verticalAlign: 'middle',
		position: 'absolute',
		right: '20px',
		paddingTop: '7px',
	},
	dialogUrlTable: {
		border: '1px solid #d5d5d5',
		borderBottom: 'none',
		boxShadow: '1px 1px 2px 0px rgba(0, 0, 0, 0.09)'
	},
	dialogUrlRow: {
		borderBottom: '1px solid rgba(224, 224, 224, 1)'
	},
	vanityUrlTableCellLanguage: {
		color: '#676767',
		fontSize: '0.875rem',
		fontWeight: '400',
		width: '50px',
		padding: '0 15px'
	},
	vanityUrlTableCellUrl: {
		color: '#00A0E3',
		fontSize: '0.875rem',
		fontWeight: '400',
		padding: '0 15px',
		wordBreak: 'break-all'
	}
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

                    </DialogContent>
                    <DialogContent>
                        <Table className={classes.dialogUrlTable}>
                            <TableBody>
                                {this.props.urlPairs.map((url, i) =>
                                    <TableRow key={i} className={classes.dialogUrlRow}>
                                        <TableCell className={this.props.classes.deleteClass + ' ' + classes.vanityUrlTableCellUrl}>{url.live.url}</TableCell>
                                        <TableCell className={classes.vanityUrlTableCellLanguage}>{url.live.language}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
						<DialogContentText className={classes.dialogNote} id="alert-dialog-content">
                            {t('label.dialogs.publishdeletion.content')}
                        </DialogContentText>
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
                        <div className={classes.dialogActionsButtonContainer}>
							<Button onClick={this.handleClose} color="default" data-vud-role="button-cancel">
								{t('label.cancel')}
							</Button>
							<Button onClick={() => {this.publish()}} color="secondary" disabled={this.state.deleteButtonState} autoFocus data-vud-role="button-primary">
	                            {t('label.actions.delete')}
	                        </Button>
						</div>
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
