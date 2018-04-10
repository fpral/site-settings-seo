import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import * as _ from "lodash";
import {Button} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {PublishMutation} from "./gqlMutations";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

class Publication extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            notificationOpen: false,
        };

        this.openNotification = this.openNotification.bind(this);
        this.closeNotification = this.closeNotification.bind(this);

        this.publish = function() {
            props.publish({variables: {pathsOrIds: _.map(this.props.urlPairs, "uuid")}});
            props.onClose();
            this.openNotification();
        };
    }

    openNotification = () => {
        this.setState({notificationOpen: true});
    };

    closeNotification = () => {
        this.setState({notificationOpen: false});
    };

    render() {
        const { open, onClose, t } = this.props;
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
                            {t('label.dialogs.publish.cancel')}
                        </Button>
                        <Button onClick={() => {this.publish()}} color="primary" autoFocus>
                            {t('label.dialogs.publish.publish')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={3000}
                    onClose={this.closeNotification}
                    open={this.state.notificationOpen}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{t('label.publicationStarted')}</span>}
                />
            </div>
        );
    }
}

Publication = compose(
    graphql(PublishMutation, {name: 'publish'}),
    translate('site-settings-seo')
)(Publication);

export default Publication;