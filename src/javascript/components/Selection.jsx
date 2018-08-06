import React from 'react';
import {AppBar, Button, IconButton, Slide, Toolbar, Typography, withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import * as _ from 'lodash';
import {Clear} from '@material-ui/icons';

const styles = (theme) => ({
    subheading: {
        flexGrow: 1
    },
    colorSecondary: {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.getContrastText(theme.palette.grey[800])
    }
});

class Selection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { t, selection, classes, onChangeSelection, actions } = this.props;

        return <Slide direction="down" in={this.props.selection.length > 0} mountOnEnter unmountOnExit>
            <AppBar position={'fixed'} color={'secondary'} classes={{colorSecondary: classes.colorSecondary}}>
                <Toolbar>
                    <IconButton onClick={() => onChangeSelection()}
                                tooltip={t('label.selection.clear')} aria-label={'close'} color={'inherit'}>
                        <Clear />
                    </IconButton>

                    <Typography variant={'subheading'} color={'inherit'} className={classes.subheading}>{t('label.selection.count', {count: selection.length })}</Typography>

                    {_.sortBy(_.filter(actions, x=>x.buttonLabel), "priority").map((action, i) =>
                        <Button key={i} color="inherit"
                                onClick={(event) => { action.call(selection, event)}}
                                data-vud-role={'toolbar-button-' + action.className}>
                            <span>{action.buttonIcon}</span>
                            {action.buttonLabel}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Slide>
    }
}

Selection = withStyles(styles)(translate()(Selection));

export { Selection }
