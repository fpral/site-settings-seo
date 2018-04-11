import React from 'react';
import * as _ from "lodash";
import {Button} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {query} from './VanityUrlTableData';
import {withNotifications} from '@jahia/react-dxcomponents';
import {withVanityMutationContext} from "./VanityMutationsProvider";

class Deletion extends React.Component {

    constructor(props) {
        super(props);

        let { vanityMutationsContext, notificationContext, t } = this.props;

        this.delete = function() {
            vanityMutationsContext.delete(_.map(this.props.urlPairs, "uuid"), _.map(this.props.urlPairs, "default.targetNode.uuid"));
            props.onClose();
            notificationContext.notify(t('label.deletionConfirmed'));
        };
    }

    render() {
        const { open, onClose, t } = this.props;
        return (
            <div>
                <Dialog open={open} fullWidth={true} onClose={onClose} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{t('label.dialogs.delete.title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {t('label.dialogs.delete.content')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            {t('label.dialogs.delete.cancel')}
                        </Button>
                        <Button onClick={() => {this.delete()}} color="primary" autoFocus>
                            {t('label.dialogs.delete.delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Deletion = compose(
    withVanityMutationContext(),
    withNotifications(),
    translate('site-settings-seo')
)(Deletion);

export default Deletion;