import React from 'react';
import {Button, Paper, Typography, withStyles} from 'material-ui';
import {translate} from 'react-i18next';
import {VanityUrlActions} from './VanityUrlActions'

let styles = theme => ({
    selectionBox: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit
    }
});

class Selection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { t, selection, classes, onChangeSelection } = this.props;

        return selection.length > 0 && <Paper elevation={1} classes={{root:classes.selectionBox}}>
            <Typography variant="subheading"> {t('label.selection.count', {count:selection.length })}</Typography>
            <Button size="small" onClick={() => onChangeSelection()}>{t('label.selection.clear')}</Button>

            <VanityUrlActions selection={selection}></VanityUrlActions>
        </Paper>
    }

}

Selection = withStyles(styles)(translate('site-settings-seo')(Selection));

export { Selection }