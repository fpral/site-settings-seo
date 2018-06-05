import React from 'react';
import {withNotifications} from '@jahia/react-material';
import * as _ from "lodash";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    withStyles
} from '@material-ui/core';
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import {withVanityMutationContext} from "./VanityMutationsProvider";

let styles = (theme) => ({
	dialogActionsContainer: {
		justifyContent: 'flex-end'
	},
});

class Publication extends React.Component {

    constructor(props) {
        super(props);
        let { vanityMutationsContext, notificationContext, t } = this.props;

        this.publish = function() {
            vanityMutationsContext.publish(_.map(this.props.urlPairs, "uuid"));
            props.onClose();
            notificationContext.notify(t('label.notifications.publicationStarted'));
        };
    }

    render() {
        const { classes, open, onClose, t } = this.props;
        return (
            <div>
                <Dialog open={open} fullWidth={true} onClose={onClose} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description" data-vud-role="dialog">
                    <DialogTitle id="alert-dialog-title">{t('label.dialogs.publish.title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {t('label.dialogs.publish.content')}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions className={classes.dialogActionsContainer}>
						<Button onClick={onClose} color="default" data-vud-role="button-cancel">
                            {t('label.cancel')}
                        </Button>
                        <Button onClick={() => {this.publish()}} color="secondary" autoFocus data-vud-role="button-primary">
                            {t('label.dialogs.publish.publish')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Publication = compose(
	withStyles(styles),
    withVanityMutationContext(),
    withNotifications(),
    translate()
)(Publication);

export default Publication;
