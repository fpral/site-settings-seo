import React from 'react';
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

let styles = (theme) => ({
	dialogActionsContainer: {
		justifyContent: 'flex-end'
	},
});

class InfoButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { classes, open, message, onClose, t } = this.props;
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
                <DialogActions className={classes.dialogActionsContainer}>
                    <Button onClick={onClose} color="secondary" autoFocus>
                        {t('label.okGotIt')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

InfoButton = compose(
	withStyles(styles),
    (translate())
)(InfoButton);

export default InfoButton;
