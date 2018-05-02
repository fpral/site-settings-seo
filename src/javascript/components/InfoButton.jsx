import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import {withStyles} from 'material-ui';
import {compose, graphql} from "react-apollo/index";
import {translate} from "react-i18next";
import {MoveMutation} from "./gqlMutations";

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
