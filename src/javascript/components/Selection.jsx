import React from 'react';
import {Button, Paper, Typography, withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import * as _ from 'lodash';
import {fade} from '@material-ui/core/styles/colorManipulator'
import {Clear} from '@material-ui/icons';
import classNames from 'classnames';

let styles = theme => ({
	root: {
		position: 'fixed',
		transition: 'top 0.3s ease-in 0s',
		top: '-130px',
		padding: '13px 8px 13px 6px',
		margin: '0',
		zIndex: '9999',
		borderRadius: '0',
		left: '0',
		width: '100%',
		boxSizing: 'border-box',
		background: '#3c3b3b'
	},
    rootExpanded: {
		top: '0',
    },
    selected: {
        margin: "14px 0 0 0",
        position: "relative",
        float: "left"
    },
	selectedText: {
		color: 'whitesmoke',
		fontSize: '14px',
		textTransform: 'none',
		fontWeight: '100',
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
        marginRight: '3px',
    },
    publish: {
        '&:hover': {
            backgroundColor: '#21282f'
        },
        backgroundColor: 'transparent',
        color: 'whitesmoke',
		fontSize: '14px',
		textTransform: 'none',
		fontWeight: '100',
    },
    delete: {
        '&:hover': {
            backgroundColor: '#21282f'
        },
        backgroundColor: 'transparent',
        color: 'whitesmoke',
		fontSize: '14px',
		textTransform: 'none',
		fontWeight: '100',
    },
    move: {
        '&:hover': {
            backgroundColor: '#21282f'
        },
        backgroundColor: 'transparent',
        color: 'whitesmoke',
		fontSize: '14px',
		textTransform: 'none',
		fontWeight: '100',
    },
    buttonStyleText: theme.typography.button,
	clearButton: {
		'&:hover': {
			backgroundColor: '#21282f',
			cursor: 'pointer'
		},
		float: 'left',
		marginTop: '8px',
		marginRight: '4px',
	    marginLeft: '10px',
		padding: '4px',
	    color: 'whitesmoke',
	}
});

class Selection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { t, selection, classes, onChangeSelection, actions } = this.props;

        return <Paper elevation={1} classes={{root: (selection.length === 0 ? '' : classes.rootExpanded)}} className={classes.root}>

			<Clear classes={{root: classes.clearButton}}
				onClick={() => onChangeSelection()}
				tooltip={t('label.selection.clear')}/>

            <div className={classes.selected}>
                <Typography className={classes.selectedText}>{t('label.selection.count', {count: selection.length })}</Typography>
            </div>

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
