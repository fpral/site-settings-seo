import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import * as _ from "lodash";
import {Button} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {DeleteVanity} from "./gqlMutations";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {query} from './VanityUrlTableData';

class Deletion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            notificationOpen: false,
        };

        this.openNotification = this.openNotification.bind(this);
        this.closeNotification = this.closeNotification.bind(this);

        this.delete = function() {
            let pathsOrIds = _.map(this.props.urlPairs, "uuid");
            let parents = _.map(this.props.urlPairs, "default.targetNode.uuid");
            props.delete({
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
                    message={<span id="message-id">{t('label.deletionConfirmed')}</span>}
                />
            </div>
        );
    }
}

Deletion = compose(
    graphql(DeleteVanity, {name: 'delete'}),
    translate('site-settings-seo')
)(Deletion);

export default Deletion;