import React from 'react';
import {translate} from 'react-i18next';
import {
    Checkbox,
    IconButton,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Input,
    withStyles, withTheme
} from 'material-ui';
import {Done, Star, StarBorder} from 'material-ui-icons';
import {LanguageMenu} from "./LanguageMenu";
import * as _ from "lodash";
import {fade} from "material-ui/styles/colorManipulator";
import {Editable} from "./Editable";
import {withVanityMutationContext} from "./VanityMutationsProvider";
import {compose} from "react-apollo/index";
import {withNotifications} from '@jahia/react-dxcomponents';

const styles = (theme) => ({
    boxTitle: {
        padding: theme.spacing.unit
    },
    vanityUrl: {
        '&:hover $hiddenOnHover': {
            transition: ["opacity", "0.25s"],
            opacity: 1
        },
		'& td': {
			padding: '7px 0'
		}
    },
	vanityUrlLive: {
	},
    hidden: {
        opacity: 0
    },
    hiddenOnHover: {
        opacity: 0,
        transition: ["opacity", "0.25s"],
    },
    table: {
        color: theme.palette.text.primary,
    },
	tableCellTextInput: {
		background: 'transparent',
		width: '100%',
		'& > div': {
		}
	},
	tableRow: {
		height: '66px',
		'&:hover $editableText': {
			marginRight: '78px'
		},
		'&:hover $vanityURLText:before': {
			background: '#ededed'
		},
		'&:hover $vanityURLText:after': {
			background: '#ededed'
		}
	},
	tableCellActionsContainer: {
		width: '76px',
		position: 'absolute',
		marginLeft: '-76px',
	},
    checkboxLeft: {
        marginLeft: '-48px',
        marginTop: '2px',
        position: 'absolute',
        border: '0',
        color: theme.palette.text.primary,
    },
	languageContainer: {
		paddingRight: '10px'
	},
	liveVanityUrl: {
		paddingLeft: '14px!important',
	},
	liveDefaultValue: {
		width: '30px'
	},
	liveLanguage: {
		color: '#676767',
		width: '50px'
	},
    inactive: {
		'& $languageContainer': {
			opacity: '0.5',
			'&:hover': {
				opacity: '1'
			}
		},
		'& $liveLanguage': {
			color: '#B2B2B2'
		},
		'& $vanityURLText': {
			color: '#B2B2B2',
		},
    },
    missingDefault: {
		fontStyle: 'italic',
		fontWeight: '100',
        color: '#B2B2B2',
		fontSize: '0.8125rem',
		paddingLeft: '22px!important',
		boxShadow: 'inset 7px 0px 0 0 #bab7b7'
    },
    missingDefaultCounterpart: {
		boxShadow: 'inset 7px 0px 0 0 ' + 'red',
		color: 'whitesmoke',
		'& td': {
			borderBottomColor: '#f66'
		},
		background: '#f66',
		'& $vanityURLText': {
			color: 'whitesmoke',
			'&:before': {
				background: '#f66'
			},
			'&:after': {
				background: '#f66'
			},
			'&:hover:after': {
				background: '#f66!important'
			},
			'&:hover:before': {
				background: '#f66!important'
			}
		},
		'& $liveLanguage': {
			color: 'whitesmoke'
		}
    },
	toBePublished: {
        boxShadow: 'inset 7px 0px 0 0 ' + '#FB9926',
        color: theme.palette.getContrastText(theme.palette.publish.main),
    },
	isPublished: {
        boxShadow: 'inset 7px 0px 0 0 #08D000',
        color: theme.palette.getContrastText(theme.palette.publish.main),
    },
    highlightText: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    publishedCheck: {
        color: 'white',
		display: 'none'
    },
    moveAction: {
        color: '#00a0e3',
		opacity: '0.6',
		'&:hover': {
			background: 'transparent',
			opacity: '1'
		}
    },
	deleteAction: {
        color: '#FB3F26',
		opacity: '0.6',
		'&:hover': {
			background: 'transparent',
			opacity: '1'
		}
    },
	actionButton: {
		width: '38px',
		'& button': {
			opacity: '0.9',
			'&:hover': {
				background: 'transparent',
				opacity: '1'
			}
		}
	},
	publish: {
        color: '#FB9926',
		marginRight: '10px',
		width: '28px',
		opacity: '0.6',
		'&:hover': {
			background: 'transparent',
			opacity: '1'
		}
    },
    allCheckbox: {
        position: "absolute",
        marginLeft: "-48px",
        marginTop: "-18px",
        '&:hover': {
            transition: ["opacity", "0.25s"],
            opacity: 1
        }
    },
    tableTitle: {
        paddingBottom: "3px",
    },
	inactiveRow: {
		border: '10px solid red'
	},
	vanityURLText: {
		color: '#00A0E3',
		lineHeight: '21px',
		maxHeight: '42px',
		overflow: 'hidden',
		position: 'relative',
		wordBreak: 'break-all',
		padding: '3px 6px 1px',
		fontSize: '0.8rem',
		'&:before': {
			content: '"..."',
			position: 'absolute',
			right: '1px',
			bottom: '1px',
			padding: '0 10px 0 4px',
			background: 'white',
			lineHeight: '19px',
		},
		'&:hover:before': {
			background: 'white!important'
		},
		'&:after': {
			content: '""',
			width: '24px',
			height: '19px',
			background: 'white',
			position: 'absolute',
			right: '1px',
			marginTop: '1px'
		},
		'&:hover:after': {
			background: 'white!important'
		},
	},
	editableText: {
		'&:hover': {
			boxShadow: 'inset 1px 1px 0 0 #b9b9b9, inset -1px -1px 0 0 #b9b9b9',
			cursor: 'text',
			background: 'white'
		}
	},
	editableField: {
	background: 'red'
	},
	publishArea: {
	},
	vanityGroupPaper: {
		boxShadow: '1px 1px 2px 0px rgba(0, 0, 0, 0.09)',
		border: '1px solid #d5d5d5',
		borderBottom: 'none',
		borderRadius: '0px'
	},
	editLine: {
    	color: 'red'
	}
});

class VanityUrlListDefault extends React.Component {

    constructor(props) {
        super(props);
        this.state = {editLine: ''};
        this.handleClick = this.handleClick.bind(this);
    }

    onMappingChanged(urlPair, actions, value, onSuccess, onError) {
        actions.updateVanity.call({urlPair: urlPair, url: value}, onSuccess, onError);
    }

    handleClick = (uuid, set) => {
    	if (set) {
            this.setState({editLine: uuid});
        } else {
            this.setState({editLine:  ''});
		}
    }

    render() {

        let { vanityUrls, classes, t, selection, onChangeSelection, expanded, actions, languages, contentUuid } = this.props;
        let urlPairs = _.filter(vanityUrls, (urlPair) => urlPair.default);

        let allCheckboxChecked = false;
        let allCheckboxIndeterminate = false;
        if (urlPairs.length > 0) {
            allCheckboxChecked = _.differenceBy(urlPairs, selection, "uuid").length === 0;
            allCheckboxIndeterminate = !allCheckboxChecked && _.intersectionBy(urlPairs, selection, "uuid").length > 0;
        }
        let checkboxesDisplayed = (allCheckboxChecked || allCheckboxIndeterminate);

        return (
            <div>
                <div>
                    {urlPairs.length > 0 ? (
                        <Checkbox className={(checkboxesDisplayed ? (expanded ? '' : classes.hidden) : (classes.hiddenOnHover)) + ' ' + classes.allCheckbox} checked={allCheckboxChecked} indeterminate={allCheckboxIndeterminate}
                                  onChange={(event, checked) => onChangeSelection(checked, urlPairs)}
                                                  data-vud-checkbox-all={contentUuid}
                        />
                    ) : ''}
                    <Typography variant="caption" classes={{caption: classes.tableTitle}}>
                        {t('label.mappings.default')}
                    </Typography>
                </div>
                <Paper elevation={2} className={classes.vanityGroupPaper}>
                    <Table className={classes.table}>

                        <TableBody data-vud-table-body-default={contentUuid}>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.default;
                                let selected = !!(_.find(selection, (p)=> p.uuid === urlPair.uuid));
                                if (url) {
                                    let classInactive = (url.active ? '' : classes.inactive);
                                    let isPublished = url.publicationInfo.publicationStatus === 'PUBLISHED';

                                    return (
                                        <TableRow key={urlPair.uuid} className={
                                        	classes.tableRow + ' ' +
											classInactive + ' ' +
											(this.state.editLine === urlPair.uuid ? classes.editLine : '')} hover classes={{
                                            root: classes.vanityUrl,
                                            hover: (isPublished ? classes.isPublished : classes.toBePublished)
                                        }}
                                       		data-vud-url={url.url}>
                                            <TableCell padding={'none'} className={(checkboxesDisplayed ? (expanded ? '' : classes.hidden) : (classes.hiddenOnHover)) + ' ' + classes.checkboxLeft}>
                                                <Checkbox onClick={(event) => {event.stopPropagation()}} checked={selected} onChange={(event, checked) => onChangeSelection(checked, [urlPair])}/>
                                            </TableCell>
                                            <TableCell padding={'none'} onClick={(event) => {console.log(url)}}>
                                                <Switch onClick={(event) => {event.stopPropagation()}} onChange={(event) => actions.updateVanity.call({urlPair: urlPair, active: event.target.checked}, event)} checked={url.active} data-vud-role="action-active"/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive + ' ' + classes.tableCellTextInput}>
                                                <Editable value={url.url}
														  onClick={this.handleClick.bind(this, urlPair.uuid)}
                                                          render={ (props) => (this.props.filterText ? <HighlightText text={props.value} highlight={this.props.filterText} classes={classes}/> : <Typography className={classes.vanityURLText + ' ' + classes.editableText}>{props.value}</Typography>) }
                                                          onChange={ this.onMappingChanged.bind(this, urlPair, actions) } />
                                            </TableCell>
                                            <TableCell padding={'none'} className={classes.hiddenOnHover + ' ' + classInactive + ' ' + classes.tableCellActionsContainer}>
                                                {selection.length === 0 ? (
                                                    <span>
                                                        <ActionButton role='action-delete' className={classes.deleteAction} action={actions.deleteAction} data={[urlPair]}/>
                                                        <ActionButton role="action-move" className={classes.moveAction} action={actions.moveAction} data={[urlPair]}/>
                                                    </span>
                                                ) : ''}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                <Checkbox className={url.default ? '' : classes.hiddenOnHover} onClick={(event) => {event.stopPropagation()}} checked={url.default} icon={<StarBorder/>} checkedIcon={<Star/>} onChange={(event) => actions.updateVanity.call({urlPair: urlPair, defaultMapping: event.target.checked}, event)}
                                                	data-vud-role="action-default"/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive + ' ' + classes.languageContainer}>
                                                <LanguageMenu languageCode={urlPair.default.language} languages={languages} onLanguageSelected={(languageCode) => actions.updateVanity.call({urlPair: urlPair, language: languageCode})}/>
                                            </TableCell>
                                            <TableCell padding={'none'} style={{textAlign: 'center'}} className={classes.publishArea}>
                                                {isPublished ? (
                                                    <Done classes={{root: classes.publishedCheck}}/>
                                                ) : (
                                                    <ActionButton role="action-publish" className={classes.publish} action={actions.publishAction} data={[urlPair]}/>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl + ' ' + classes.tableRow}>
                                            <TableCell colSpan={7} className={classes.missingDefault}>
                                                {urlPair.live && urlPair.live.editNode ? (
                                                        t('label.mappings.movedDefault', {page: urlPair.live.editNode.targetNode.displayName})
                                                    ) :
                                                    t('label.mappings.missingDefault', {vanityUrl: urlPair.live.url})
                                                }
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

class VanityUrlListLive extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deletionUrls: []
        };
    }

    render() {
        let { vanityUrls, classes, t, actions, contentUuid } = this.props;
        let deletedUrls = _.filter(vanityUrls, (urlPair) => urlPair.live && !urlPair.live.editNode);

        // get all vanity with default not published
        let defaultNotPublished = _.map(_.filter(vanityUrls, (urlPair) =>  urlPair.live && urlPair.default && !urlPair.default.default && urlPair.live.default), urlPair => urlPair.live);
        // get all languages of live  vanity set as default
        let defaultPerLanguages = _.filter(_.map(vanityUrls, (urlPair) => urlPair.live && urlPair.live.default ? urlPair.live.language : null));
        // check for multiple languages
        let multipleDefaultLang = (_.filter(defaultPerLanguages, function (value, index, iter) {
                return _.includes(iter, value, index + 1);
            }));
        // filter found languages
        defaultNotPublished = _.filter(defaultNotPublished, vanity => _.includes(multipleDefaultLang, vanity.language));
        return (
            <div>
                <div>
                    <Typography variant="caption" classes={{caption: classes.tableTitle}}>
                        {t('label.mappings.live')}
                    </Typography>
                </div>
                <Paper elevation={2} className={classes.vanityGroupPaper}>
                    <Table className={classes.table}>
                        <TableBody data-vud-table-body-live={contentUuid}>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.live;
                                if (url) {
                                    let classInactive = (url.active ? '' : classes.inactive);
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.tableRow + ' ' + classInactive + ' ' + classes.vanityUrl + ' ' + classes.vanityUrlLive + ' ' + ((urlPair.default  && !_.includes(defaultNotPublished, url)) ? '' : classes.missingDefaultCounterpart)}>
                                            <TableCell padding={'none'} className={classInactive + ' ' + classes.liveVanityUrl}>
                                                {this.props.filterText ? <HighlightText text={url.url} highlight={this.props.filterText} classes={classes}/> : <Typography className={classes.vanityURLText}>{url.url}</Typography>}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive + ' ' + classes.liveDefaultValue}>
                                                {url.default ? <Star color={url.active ? 'secondary' : 'disabled'}/> : ''}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive} className={classes.liveLanguage}>
                                                {url.language}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive + ' ' + classes.actionButton} style={{textAlign: 'center'}}>
                                                {url.editNode ?
                                                    (url.editNode.path !== url.path ?
                                                        <ActionButton action={actions.infoButton} data={url.editNode.targetNode.path ? (
                                                            t('label.dialogs.infoButton.moveAction', {pagePath: url.editNode.targetNode.path})
                                                        ) : ('')}/> :
                                                        _.includes(defaultNotPublished, url) ? <ActionButton action={actions.infoButton} data={
                                                                t('label.dialogs.infoButton.notPublished', {pagePath: url.editNode.targetNode.path})}/>
                                                             : '')
                                                    :
                                                    <ActionButton role="action-publishDeletion" action={actions.publishDeleteAction} data={deletedUrls}/>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl + ' ' + classes.tableRow}>
                                            <TableCell colSpan={4} padding={'none'}>
                                                {/*Not published yet */}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

class HighlightText extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let highlight = this.props.highlight;
        let highlightEscaped = highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        let parts = this.props.text.split(new RegExp(`(${highlightEscaped})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    <span key={i} className={part.toLowerCase() === highlight.toLowerCase() ? this.props.classes.highlightText : ''}>
                        {part}
                    </span>
                )}
            </span>
        )
    }
}

class ActionButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {action, data, className, role} = this.props;
        return (
            <IconButton className={className} aria-label={action.buttonLabel} onClick={(event) => {
                event.stopPropagation();
                action.call(data, event);
            }} data-vud-role={role}>
                {action.body}
                {action.buttonIcon}
            </IconButton>
        );
    }
}

VanityUrlListDefault = compose(
    withStyles(styles),
    withVanityMutationContext(),
    withNotifications(),
    translate()
)(VanityUrlListDefault);

VanityUrlListLive = compose(
    withStyles(styles),
    translate()
)(VanityUrlListLive);

export {VanityUrlListLive};
export {VanityUrlListDefault};
