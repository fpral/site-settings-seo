import React from 'react';
import {Button, Paper, Typography, withStyles} from 'material-ui';
import {translate} from 'react-i18next';
import {VanityUrlActions} from './VanityUrlActions'

let styles = theme => ({
    root: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        transition: ["max-height","0.25s"],
        maxHeight: "100px"
    },
    rootHidden: {
        margin: "0 " + theme.spacing.unit + " 0 " +theme.spacing.unit,
        padding: "0 " + theme.spacing.unit + " 0 " +theme.spacing.unit,
        maxHeight: "0px",
        overflow: "hidden",
        transition: ["max-height","0.25s"],
    },

});

class Selection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { t, selection, classes, onChangeSelection } = this.props;

        return <Paper elevation={1} classes={{root: (selection.length === 0 ? classes.rootHidden : classes.root)}}>
            <Typography variant="subheading"> {t('label.selection.count', {count:selection.length })}</Typography>
            <Button size="small" onClick={() => onChangeSelection()}>{t('label.selection.clear')}</Button>

            <VanityUrlActions selection={selection}></VanityUrlActions>
        </Paper>
    }

}

Selection = withStyles(styles)(translate('site-settings-seo')(Selection));

export { Selection }