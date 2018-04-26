import React from 'react';
import {Button, Paper, Typography, withStyles, Chip} from 'material-ui';
import {translate} from 'react-i18next';
import * as _ from 'lodash';
import {fade, emphasize, lighten} from 'material-ui/styles/colorManipulator'
import {Clear} from "material-ui-icons";
import classNames from 'classnames';

let styles = theme => ({
    root: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        transition: ["max-height", "0.25s"],
        height: "48px",
        maxHeight: "48px"
    },
    rootHidden: {
        margin: "0 " + theme.spacing.unit + " 0 " +theme.spacing.unit,
        padding: "0 " + theme.spacing.unit + " 0 " +theme.spacing.unit,
        maxHeight: "0px",
        overflow: "hidden",
        transition: ["max-height", "0.25s"],
    },
    selected: {
        margin: "14px 0 0 8px",
        position: "relative",
        float: "left"
    },
    clearChip: {
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.main, 0.7)
        },
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        position: "relative",
        float: "left",
        margin: "7px 0 0 7px"
    },
    clearIcon: {
        marginLeft: "-2px",
        fontSize: "1rem",
        float: "left"
    },
    clearText: {
        marginLeft: theme.spacing.unit,
        float: "left"
    },
    buttonsBar: {
        margin: "4",
        position: "relative",
        float: "right"
    },
    buttonAction: {
        marginLeft: theme.spacing.unit,
    },
    buttonActionLeftIcon: {
        marginRight: theme.spacing.unit,
    },
    publish: {
        '&:hover': {
            backgroundColor: fade(theme.palette.publish.main, 0.7)
        },
        backgroundColor: theme.palette.publish.main,
        color: theme.palette.getContrastText(theme.palette.publish.main),
    },
    delete: {
        '&:hover': {
            backgroundColor: fade(theme.palette.delete.main, 0.7)
        },
        backgroundColor: theme.palette.delete.main,
        color: theme.palette.getContrastText(theme.palette.delete.main),
    },
    move: {
        '&:hover': {
            backgroundColor: fade(theme.palette.secondary.main, 0.7)
        },
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    },
    buttonStyleText: theme.typography.button
});

class Selection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { t, selection, classes, onChangeSelection, actions } = this.props;

        return <Paper elevation={1} classes={{root: (selection.length === 0 ? classes.rootHidden : classes.root)}}>
            <div className={classes.selected}>
                <Typography >{t('label.selection.count', {count: selection.length })}</Typography>
            </div>

            <Chip
                className={classes.clearChip}
                label={<span><Clear className={classes.clearIcon}/><span className={classNames(classes.clearText, classes.buttonStyleText)}>{t('label.selection.clear')}</span></span>}
                onClick={() => onChangeSelection()}
            />

            <div className={classes.buttonsBar}>
                { _.sortBy(_.filter(actions, x=>x.buttonLabel), "priority").map((action, i) =>
                    <Button key={i}
                            onClick={(event) => { action.call(selection, event)}}
                            className={classNames(classes[action.className], classes.buttonAction)}
                            data-vud-role={'toolbar-button-' + action.className}>
                        <span className={classes.buttonActionLeftIcon}>{action.buttonIcon}</span>
                        {action.buttonLabel}
                    </Button>) }
            </div>
        </Paper>
    }

}

Selection = withStyles(styles)(translate()(Selection));

export { Selection }