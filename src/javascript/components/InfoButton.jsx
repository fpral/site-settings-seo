import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";

class InfoButton extends React.Component {

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
                    <Button onClick={onClose} color="secondary" autoFocus>
                        {t('label.okGotIt')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

InfoButton = compose((translate()))(InfoButton);

export default InfoButton;
