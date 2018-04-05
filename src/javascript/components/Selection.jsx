import React from 'react';
import {Button, Paper, Typography, withStyles, Chip} from 'material-ui';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import {translate} from 'react-i18next';
import * as _ from 'lodash';
import {fade, emphasize, lighten} from 'material-ui/styles/colorManipulator'

let styles = theme => ({
    root: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        transition: ["max-height","0.25s"],
        height: "48px",
        maxHeight: "48px"
    },
    rootHidden: {
        margin: "0 " + theme.spacing.unit + " 0 " +theme.spacing.unit,
        padding: "0 " + theme.spacing.unit + " 0 " +theme.spacing.unit,
        maxHeight: "0px",
        overflow: "hidden",
        transition: ["max-height","0.25s"],
    },
    text : {
        margin:"8",
        position: "relative",
        float:"left"
    },
    buttonsBar : {
        margin: "6",
        position: "relative",
        float:"right"
    },
    snackBar: {
        backgroundColor: theme.palette.primary.dark,
        width: '20%',
        height:'10%'
    }
});

class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showModal: false, actionClicked: {}, showSnackBar: false};
        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this.handleOpenSnackBar = this.handleOpenSnackBar.bind(this);
    }

    handleClick(action) {
        this.setState({
            showModal: true,
            actionClicked: action,
            showSnackBar: false
        });
    }

    handleCancel(){
        this.setState({
            showModal: false
        });
    }

    handleCloseSnackbar() {
        this.setState({
            showSnackBar: false
        });
    }

    handleOpenSnackBar() {
        this.setState({
            showSnackBar: true
        })
    }

    render() {
        let { t, selection, classes, onChangeSelection,actions } = this.props;

        return <Paper elevation={1} classes={{root: (selection.length === 0 ? classes.rootHidden : classes.root)}}>
            <Chip
                label={t('label.selection.count', {count:selection.length })}
                onDelete={() => onChangeSelection()}
                classes={{root:classes.text}}
            />

            {/*<Typography variant="subheading" classes={{root:classes.text}}></Typography>*/}
            {/*<Button size="small" onClick={() => onChangeSelection()}>{t('label.selection.clear')}</Button>*/}
            <div className={classes.buttonsBar}>
                { _.filter(actions, x=>x.buttonLabel).map((action,i) =>
                    <Button key={i}
                            onClick={(event) => { this.handleClick(action)}}
                            style={{backgroundColor:fade(action.generalColor,0.5)}}>
                        {action.buttonLabel}
                    </Button>) }


                <Dialog open={this.state.showModal} fullWidth={true} onClose={this.handleCancel} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to perform this actions ?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button key={this.state.actionClicked.buttonLabel}
                                onClick={(event) => { this.state.actionClicked.call(selection, event); this.handleCancel(); this.handleOpenSnackBar()}}
                                color="primary" autoFocus>
                            {this.state.actionClicked.buttonLabel}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.showSnackBar} onClose={this.handleCloseSnackbar} autoHideDuration={3000}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'left',}} className={classes.snackBar}>
                    <Typography>Publication job started on background</Typography>
                </Snackbar>
            </div>
        </Paper>
    }

}

Selection = withStyles(styles)(translate('site-settings-seo')(Selection));

export { Selection }