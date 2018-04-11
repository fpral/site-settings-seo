import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import * as _ from "lodash";
import {Button} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {DeleteVanity} from "./gqlMutations";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {query} from './VanityUrlTableData';
import {withNotifications} from '@jahia/react-dxcomponents';

class Deletion extends React.Component {

    constructor(props) {
        super(props);

        let { deleteMutation, notificationContext, t } = this.props;

        this.delete = function() {
            let pathsOrIds = _.map(this.props.urlPairs, "uuid");
            let parents = _.map(this.props.urlPairs, "default.targetNode.uuid");
            deleteMutation({
                variables: {
                    pathsOrIds: pathsOrIds
                },
                update:(proxy) => {
                    // Manually clean cache from parent list
                    _.each(parents, (uuid) => {
                        let parentNode = proxy.data.data[proxy.config.dataIdFromObject({uuid:uuid, workspace:"EDIT"})];
                        let list = parentNode[_.find(Object.keys(parentNode), (k) => k.startsWith("vanityUrls"))];
                        _.each(pathsOrIds, (vanityUuid) => {
                            let id = proxy.config.dataIdFromObject({uuid:vanityUuid, workspace:"EDIT"});
                            _.remove(list, (v) => (v.id === id))
                        });
                    });
                    _.each(pathsOrIds, (id) => {
                        let liveNode = proxy.data.data[proxy.config.dataIdFromObject({uuid:id, workspace:"LIVE"})];
                        liveNode[_.find(Object.keys(liveNode), (k) => k.startsWith("nodeInWorkspace"))] = null;
                    });
                }
            });
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
    graphql(DeleteVanity, {name: 'deleteMutation'}),
    withNotifications(),
    translate('site-settings-seo')
)(Deletion);

export default Deletion;