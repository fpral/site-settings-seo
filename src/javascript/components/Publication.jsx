import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import * as _ from "lodash";
import {Button} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {PublishMutation} from "./mutations";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

class Publication extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            notificationOpen: false,
        };

        this.handleOpenNotification = this.handleOpenNotification.bind(this);
        this.handleCloseNotification = this.handleCloseNotification.bind(this);

        this.publish = function() {

            // props and this.props are different
            // props: is in closure state and have the initialisation values
            // this.props: have the current props in current context
            props.publish({variables: {pathsOrIds: _.map(this.props.urlPairs, "uuid")}});
            props.onClose();
            this.handleOpenNotification();
        };
    }

    handleOpenNotification = () => {
        this.setState({notificationOpen: true});
    };

    handleCloseNotification = () => {
        this.setState({notificationOpen: false});
    };

    render() {
        const { open, onClose, action, t } = this.props;
        return (
            <div>
                <Dialog open={open} fullWidth={true} onClose={onClose} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{t('label.dialogs.publish.title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {t('label.dialogs.publish.content')}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            Cancel
                        </Button>
                        <Button key={action.buttonLabel}
                                onClick={() => {this.publish()}}
                                color="primary" autoFocus>
                            {action.buttonLabel}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={3000}
                    onClose={this.handleCloseNotification}
                    open={this.state.notificationOpen}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{t('label.publishSnackBar')}</span>}
                />
            </div>
        );
    }
}

Publication = compose(
    graphql(PublishMutation, {name: 'publish'}),
    (translate('site-settings-seo'))
)(Publication);

export default Publication;