import React from 'react';
import * as _ from "lodash";
import {Button, Checkbox, FormControlLabel, TextField, Paper, withStyles, FormControl, FormHelperText} from 'material-ui';
import {compose} from "react-apollo/index";
import {translate} from "react-i18next";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {withNotifications, Picker, PickerViewMaterial} from '@jahia/react-dxcomponents';
import {withVanityMutationContext} from "./VanityMutationsProvider";
import {Note} from 'material-ui-icons'
import {GetNodeQuery} from "./gqlQueries";
import {Query} from 'react-apollo';

let styles = (theme) => ({
    pickerRoot: {
        maxHeight: "calc(100% - 350px)",
        overflowY: "scroll"
    },
    formControl:{
        width:"100%",
        "& error": {
        },
        "& message": {
            display:"none"
        },
        "& label": {
        }
    }
});

class Move extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            targetPath: '',
            saveDisabled: true
        };

        this.handleMove = this.handleMove.bind(this);
        this.handleSaveDisabled = this.handleSaveDisabled.bind(this);
        this.handleTargetPathChange = this.handleTargetPathChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleMove() {
        let { vanityMutationsContext, notificationContext, t } = this.props;
        try {
            vanityMutationsContext.move(_.map(this.props.urlPairs, "uuid"), this.state.targetPath, this.props)
                .then(() => {
                    this.handleClose();
                    notificationContext.notify(t("label.notifications.moveConfirmed"));
                })
                .catch((errors) => {
                    if (errors.graphQLErrors) {
                        _.each(errors.graphQLErrors, (error) => {
                            notificationContext.notify(error.message);
                        })
                    } else {
                        notificationContext.notify(t("label.errors.Error"));
                    }
                    console.log(errors)
                });
        } catch (e) {
            notificationContext.notify(t("label.errors." + (e.name ? e.name : "Error")));
        }
    };

    handleSaveDisabled() {
        this.setState((previous) => ({saveDisabled: !previous.saveDisabled}));
    }

    handleTargetPathChange(event) {
        this.setState({targetPath: event.target.value});
    }

    handleClose() {
        this.setState({
            targetPath: '',
            saveDisabled: true
        });
        this.props.onClose()
    }

    render() {
        const { t, classes, lang, path } = this.props;
        return (
            <div>
                <Query fetchPolicy={"network-only"} query={GetNodeQuery} variables={{path:this.state.targetPath}}>
                    {({ loading, error, data }) => <Dialog
                    open={this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    data-vud-role="dialog"
                >
                    <DialogTitle id="form-dialog-title">{t("label.dialogs.move.title")}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{t("label.dialogs.move.content")}</DialogContentText>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    autoFocus
                                    error={!!error}
                                    margin="dense"
                                    id="targetPath"
                                    label={t("label.dialogs.move.target")}
                                    type="text"
                                    value={this.state.targetPath} onChange={this.handleTargetPathChange}
                                    fullWidth
                                />
                                <FormHelperText>{error && <error><label>{t("label.errors.MoveInvalidTarget")}</label><message>{t(["label.errors.MoveInvalidTarget_message", "label.errors.MoveInvalidTarget"])}</message></error>}</FormHelperText>
                            </FormControl>
                            <Paper elevation={4} classes={{root:classes.pickerRoot}}>
                                <Picker fragments={["displayName"]}
                                        render={PickerViewMaterial}
                                        rootPaths={[path]}
                                        defaultOpenPaths={[path]}
                                        openableTypes={['jnt:page', 'jnt:virtualsite']}
                                        selectableTypes={['jnt:page']}
                                        queryVariables={{lang: lang}}
                                        textRenderer={(entry) => entry.node.displayName}
                                        iconRenderer={(entry) => <Note/>}
                                        selectedPaths={!loading && !error && data.jcr && data.jcr.nodeByPath.inPicker ? [data.jcr.nodeByPath.path] : []}
                                        onSelectItem={(path) => {
                                            this.setState({targetPath: path});
                                        }}/>
                            </Paper>
                        </DialogContent>
                    <DialogActions>
                        <span>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={!this.state.saveDisabled}
                                              onChange={() => this.handleSaveDisabled()}
                                              data-vud-role="checkbox-hint" />
                                }
                                label={t("label.dialogs.move.confirm")}
                            />
                            <Button onClick={this.handleClose} color="primary" data-vud-role="button-cancel">{t("label.cancel")}</Button>
                            <Button onClick={this.handleMove} color="primary" disabled={this.state.saveDisabled || this.state.targetPath.length === 0 || !!error} data-vud-role="button-primary">{t("label.dialogs.move.move")}</Button>
                        </span>
                    </DialogActions>
                </Dialog>
                    }
                </Query>
            </div>
        );
    }
}

Move = compose(
    withStyles(styles),
    withVanityMutationContext(),
    withNotifications(),
    (translate())
)(Move);

export default Move;