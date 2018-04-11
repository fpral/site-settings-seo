import React from 'react';
import {withNotifications} from '@jahia/react-dxcomponents';
import * as _ from "lodash";
import {Button} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {PublishMutation} from "./gqlMutations";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

class Publication extends React.Component {

    constructor(props) {
        super(props);
        let { publishMutation, notificationContext, t } = this.props;

        this.publish = function() {
            publishMutation({variables: {pathsOrIds: _.map(this.props.urlPairs, "uuid")}});
            props.onClose();
            notificationContext.notify(t('label.publicationStarted'));
        };
    }

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
            </div>
        );
    }
}

Publication = compose(
    graphql(PublishMutation, {name: 'publishMutation'}),
    withNotifications(),
    translate('site-settings-seo')
)(Publication);

export default Publication;