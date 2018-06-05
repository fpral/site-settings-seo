import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, IconButton, Snackbar} from '@material-ui/core';
import {Close} from '@material-ui/icons';

const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
});

class ErrorSnackBar extends React.Component {
    state = {
        open: true,
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    };

    render() {
        const { classes, error } = this.props;
        return <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={this.state.open}
            onClose={this.handleClose}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{error}</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={this.handleClose}
                >
                    <Close />
                </IconButton>,
            ]}
        />;
    }
}

ErrorSnackBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorSnackBar);