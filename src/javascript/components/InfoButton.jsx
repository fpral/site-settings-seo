import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {MoveMutation} from "./gqlMutations";


class MoveInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { open, message, onClose, t } = this.props;
        return (
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">

                <DialogTitle id="alert-dialog-title">{t('label.importantInfo')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary" autoFocus>
                        {t('label.okGotIt')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

MoveInfo = compose(
    (translate('site-settings-seo'))
)(MoveInfo);

export default MoveInfo;