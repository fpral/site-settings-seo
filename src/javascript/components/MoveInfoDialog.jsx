import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';


class MoveInfoDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClose = () => {
        this.props.onClose();
    };

    render() {
        let { open, path, t } = this.props;
        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">

                <DialogTitle id="alert-dialog-title">{t('label.importantInfo')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('label.dialogs.moveInfo.content', {pagePath: path})}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary" autoFocus>
                        {t('label.okGotIt')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default MoveInfoDialog;