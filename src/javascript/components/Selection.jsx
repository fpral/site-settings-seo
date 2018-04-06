import React from 'react';
import {Button, Paper, Typography, withStyles, Chip} from 'material-ui';
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
});

class Selection extends React.Component {

    constructor(props) {
        super(props);
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
                            onClick={(event) => { action.call(selection, event)}}
                            style={{backgroundColor:fade(action.generalColor,0.5)}}>
                        {action.buttonLabel}
                    </Button>) }
            </div>
        </Paper>
    }

}

Selection = withStyles(styles)(translate('site-settings-seo')(Selection));

export { Selection }