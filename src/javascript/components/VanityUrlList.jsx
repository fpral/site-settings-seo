import React from 'react';
import {translate} from 'react-i18next';
import {
    Checkbox,
    IconButton,
    Paper,
    Switch,
    Typography,
    Grid,
    Tooltip,
    withStyles
} from '@material-ui/core';
import {Star, StarBorder} from '@material-ui/icons';
import {LanguageMenu} from "./LanguageMenu";
import * as _ from "lodash";
import {Editable} from "./Editable";
import {withVanityMutationContext} from "./VanityMutationsProvider";
import {compose} from "react-apollo/index";
import {withNotifications} from '@jahia/react-material';

const styles = (theme) => ({
    mainCheckbox: {
	    height: 16
    },
    actionButton: {
		width: 38,
		height: 38,
        '&:hover': {
            background: 'transparent',
            opacity: 1
        }
	},
    highlightText: {
        backgroundColor: '#FFEB3B',
        color: theme.palette.getContrastText('#FFEB3B')
    },
    vanityRow: {
        height: theme.spacing.unit * 8
    },
    vanityRowPaper: {
        '&:hover': {
            backgroundColor: theme.palette.grey[100]
        }
    },
	toBePublished: {
        borderLeft: '7px solid #FB9926'
    },
	isPublished: {
        borderLeft: '7px solid #08D000'
    },
	vanityURLText: {
        wordBreak: 'break-all',
        maxHeight: theme.spacing.unit * 5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
	},
    editableVanityUrl: {
        '&:hover $vanityURLText': {
            boxShadow: 'inset 1px 1px 0 0 ' + theme.palette.grey['A100'] + ', inset -1px -1px 0 0 ' + theme.palette.grey['A100'],
            cursor: 'text',
            background: 'white',
            padding: theme.spacing.unit
        }
    },
    inactiveUrl: {
		'& $vanityURLText': {
			color: theme.palette.grey['A200'],
		}
    },
    marginRight: {
        marginRight: theme.spacing.unit * 2
    },
    marginLeft: {
        marginLeft: theme.spacing.unit * 2
    },
    missingDefaultCounterpart: {
        borderLeft: '7px solid red',
		backgroundColor: '#f66',
        color: theme.palette.getContrastText('#f66'),
        '&:hover': {
			background: '#f66',
		},
		'& $vanityURLText': {
            color: theme.palette.getContrastText('#f66'),
        },
		'& $liveLanguage': {
            color: theme.palette.getContrastText('#f66'),
		}
    },
    missingDefault: {
        borderLeft: '7px solid ' + theme.palette.grey['A200']
    },
    liveLanguage: {}
});

class VanityUrlListDefault extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editLine: '',
            hoverLine: ''
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleHover = this.handleHover.bind(this);
    }

    onMappingChanged(urlPair, actions, value, onSuccess, onError) {
        actions.updateVanity.call({urlPair: urlPair, url: value}, onSuccess, onError);
    }

    handleEdit = (uuid, set) => {
    	if (set) {
            this.setState({editLine: uuid});
        } else {
            this.setState({editLine:  ''});
		}
    };

    handleHover(uuid) {
        this.setState({
            hoverLine: uuid
        });
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
            <Grid container direction={'column'} spacing={0} justify={'flex-end'} alignItems={'flex-start'}>
                <Grid item
                      onMouseEnter={this.handleHover.bind(this, 'caption')}
                      onMouseLeave={this.handleHover.bind(this, '')}
                      container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'flex-end'}>
                    <Grid item xs={1}>
                        {((urlPairs.length > 0 && checkboxesDisplayed) || this.state.hoverLine === 'caption') ? (
                            <Checkbox classes={{root: classes.mainCheckbox}}
                                      checked={allCheckboxChecked} indeterminate={allCheckboxIndeterminate}
                                      onChange={(event, checked) => onChangeSelection(checked && !allCheckboxIndeterminate, urlPairs)}
                                      data-vud-checkbox-all={contentUuid}
                            />
                        ) : null}
                    </Grid>
                    <Grid item>
                        <Typography variant="caption">
                            {t('label.mappings.default')}
                        </Typography>
                    </Grid>
                </Grid>
                    {vanityUrls.map(urlPair => {
                        let url = urlPair.default;
                        let selected = !!(_.find(selection, (p)=> p.uuid === urlPair.uuid));
                        if (url) {
                            let classInactive = (url.active ? '' : ' ' + classes.inactiveUrl);
                            let isPublished = url.publicationInfo.publicationStatus === 'PUBLISHED';

                            return (
                                <Grid key={urlPair.uuid} item
                                      onMouseEnter={this.handleHover.bind(this, urlPair.uuid)}
                                      onMouseLeave={this.handleHover.bind(this, '')}
                                      container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                                    <Grid item xs={1}>
                                        {(this.state.hoverLine === urlPair.uuid || checkboxesDisplayed) ?
                                            <Checkbox onClick={(event) => {event.stopPropagation()}} checked={selected} onChange={(event, checked) => onChangeSelection(checked, [urlPair])}/>
                                        : null}
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Paper elevation={1} square={true} classes={{root: classes.vanityRowPaper}}
                                               className={(isPublished ? classes.isPublished : classes.toBePublished) + classInactive}>
                                            <Grid classes={{container: classes.vanityRow}}
                                                  container direction={'row'} spacing={0} justify={'space-between'} alignItems={'center'}>
                                                <Grid item
                                                      xs={(this.state.editLine === urlPair.uuid) ? 11 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 6 : 8}
                                                      sm={(this.state.editLine === urlPair.uuid) ? 11 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 4 : 7}
                                                      md={(this.state.editLine === urlPair.uuid) ? 11 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 5 : 7}
                                                      lg={(this.state.editLine === urlPair.uuid) ? 11 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 7 : 8}
                                                      >
                                                    <Grid container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                                                        <Grid item>
                                                            <Switch onClick={(event) => {event.stopPropagation()}} onChange={(event) => actions.updateVanity.call({urlPair: urlPair, active: event.target.checked}, event)} checked={url.active} data-vud-role="action-active"/>
                                                        </Grid>
                                                        <Tooltip title={url.url}>
                                                            <Grid item
                                                                  xs={9}
                                                                  sm={(this.state.editLine === urlPair.uuid) ? 9 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 4 : 8}
                                                                  md={(this.state.editLine === urlPair.uuid) ? 9 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 5 : 8}
                                                                  lg={(this.state.editLine === urlPair.uuid) ? 9 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 6 : 9}>
                                                                <Editable value={url.url}
                                                                          className={classes.editableVanityUrl}
                                                                          onEdit={this.handleEdit.bind(this, urlPair.uuid)}
                                                                          hovered={(this.state.hoverLine === urlPair.uuid && selection.length === 0)}
                                                                          render={ (props) => (
                                                                              this.props.filterText ?
                                                                                  <HighlightText text={props.value} highlight={this.props.filterText} classes={classes}/>
                                                                                  :
                                                                                  <Typography color={'secondary'}
                                                                                              className={classes.vanityURLText}>{props.value}</Typography>)
                                                                          }
                                                                          onChange={ this.onMappingChanged.bind(this, urlPair, actions) } />

                                                            </Grid>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                                <Grid item
                                                      xs={(this.state.editLine === urlPair.uuid) ? 1 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 6 : 4}
                                                      sm={(this.state.editLine === urlPair.uuid) ? 1 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 8 : 5}
                                                      md={(this.state.editLine === urlPair.uuid) ? 1 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 7 : 5}
                                                      lg={(this.state.editLine === urlPair.uuid) ? 1 : (this.state.hoverLine === urlPair.uuid && selection.length === 0) ? 5 : 4}
                                                      >
                                                    <Grid container direction={'row'} spacing={0} justify={'flex-end'} alignItems={'center'}>
                                                        {this.state.editLine !== urlPair.uuid && this.state.hoverLine === urlPair.uuid && selection.length === 0 ?
                                                            <Grid item>
                                                                {selection.length === 0 ? (
                                                                    <span>
                                                                        <ActionButton role='action-delete' className={classes.actionButton} action={actions.deleteAction} data={[urlPair]}/>
                                                                        <ActionButton role="action-move" className={classes.actionButton} action={actions.moveAction} data={[urlPair]}/>
                                                                    </span>
                                                                ) : null}
                                                            </Grid>
                                                            : null}
                                                        {(url.default && this.state.editLine !== urlPair.uuid) || (this.state.editLine !== urlPair.uuid && this.state.hoverLine === urlPair.uuid) ?
                                                            <Grid item>
                                                                <Checkbox onClick={(event) => {event.stopPropagation()}}
                                                                          checked={url.default}
                                                                          icon={<StarBorder/>}
                                                                          checkedIcon={<Star/>}
                                                                          onChange={(event) => actions.updateVanity.call({urlPair: urlPair, defaultMapping: event.target.checked}, event)}
                                                                          data-vud-role="action-default"/>
                                                            </Grid>
                                                            : null}
                                                        {this.state.editLine !== urlPair.uuid ?
                                                            <Grid item>
                                                                <LanguageMenu languageCode={urlPair.default.language} languages={languages} onLanguageSelected={(languageCode) => actions.updateVanity.call({urlPair: urlPair, language: languageCode})}/>
                                                            </Grid>
                                                            : null}
                                                        {!isPublished ?
                                                            <Grid item>
                                                                <ActionButton role="action-publish" className={classes.actionButton} action={actions.publishAction} data={[urlPair]}/>
                                                            </Grid>
                                                            : null}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid key={urlPair.uuid} item
                                      container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                                    <Grid item xs={1} />
                                    <Grid item xs={11}>
                                        <Paper elevation={1} square={true} classes={{root: classes.vanityRowPaper}} className={classes.missingDefault}>
                                            <Grid classes={{container: classes.vanityRow}}
                                                  container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                                                <Grid item xs={12}>
                                                    {urlPair.live && urlPair.live.editNode ? (
                                                            <Typography color={'textSecondary'} className={classes.marginLeft}>
                                                                <em>{t('label.mappings.movedDefault', {page: urlPair.live.editNode.targetNode.displayName})}</em>
                                                            </Typography>
                                                        ) :
                                                        <Typography color={'textSecondary'} className={classes.marginLeft}>
                                                            <em>{t('label.mappings.missingDefault', {vanityUrl: urlPair.live.url})}</em>
                                                        </Typography>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            );
                        }
                    })}
            </Grid>
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
            <Grid container direction={'column'} spacing={0} justify={'flex-end'} alignItems={'flex-start'}>
                <Grid item
                      container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'flex-end'}>
                    <Grid item>
                        <Typography variant="caption">
                            {t('label.mappings.live')}
                        </Typography>
                    </Grid>
                </Grid>
                {vanityUrls.map(urlPair => {
                    let url = urlPair.live;
                    if (url) {
                        let classInactive = (url.active ? '' : ' ' + classes.inactiveUrl);
                        return (
                            <Grid key={urlPair.uuid} item
                                  container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                                <Grid item xs={12}>
                                    <Paper elevation={1} square={true}
                                           className={classes.vanityRowPaper + ' ' + classInactive + ' ' + ((urlPair.default  && !_.includes(defaultNotPublished, url)) ? '' : classes.missingDefaultCounterpart)}>
                                        <Grid classes={{container: classes.vanityRow}}
                                              container direction={'row'} spacing={0} justify={'space-between'} alignItems={'center'}>
                                            <Grid item xs={5} sm={6} md={7} lg={8}>
                                                <Grid container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                                                    <Grid item xs={12} className={classes.marginLeft}>
                                                        <Tooltip title={url.url}>
                                                            {this.props.filterText ?
                                                                <HighlightText text={url.url} highlight={this.props.filterText} classes={classes}/>
                                                                :
                                                                <Typography color={url.active ? 'secondary' : 'primary'}
                                                                            className={classes.vanityURLText}>{url.url}</Typography>
                                                            }
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item className={classes.marginRight}>
                                                <Grid container direction={'row'} spacing={8} justify={'flex-end'} alignItems={'center'}>
                                                    {url.default ?
                                                        <Grid item>
                                                            <Star color={url.active ? 'secondary' : 'disabled'}/>
                                                        </Grid>
                                                        : null}
                                                    <Grid item>
                                                        <Typography color={url.active ? 'default' : 'primary'} className={classes.liveLanguage}>{url.language}</Typography>
                                                    </Grid>
                                                    {url.editNode ?
                                                        (url.editNode.path !== url.path ?
                                                            <Grid item>
                                                                <ActionButton action={actions.infoButton}
                                                                              data={url.editNode.targetNode.path ? (t('label.dialogs.infoButton.moveAction', {pagePath: url.editNode.targetNode.path})) : null }/>
                                                            </Grid>
                                                            : _.includes(defaultNotPublished, url) ?
                                                                <Grid item>
                                                                    <ActionButton action={actions.infoButton}
                                                                                  data={t('label.dialogs.infoButton.notPublished', {pagePath: url.editNode.targetNode.path})}/>
                                                                </Grid>
                                                                : null)
                                                        :
                                                        <Grid item>
                                                            <ActionButton role="action-publishDeletion" action={actions.publishDeleteAction} data={deletedUrls}/>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        );
                    } else {
                        return (
                            <Grid item key={urlPair.uuid}
                                  container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                                <Grid item xs={12}>
                                    <Paper elevation={1} square={true} classes={{root: classes.vanityRowPaper}}>
                                        <Grid classes={{container: classes.vanityRow}}
                                              container direction={'row'} spacing={0} justify={'flex-start'} alignItems={'center'}>
                                            <Grid item xs={12}>
                                                {/*Not published yet */}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        );
                    }
                })}
            </Grid>
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
            <Typography color={'secondary'}
                        className={this.props.classes.vanityURLText}>
                {parts.map((part, i) =>
                    <span key={i} className={part.toLowerCase() === highlight.toLowerCase() ? this.props.classes.highlightText : ''}>
                        {part}
                    </span>
                )}
            </Typography>
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
