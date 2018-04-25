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
        }
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
    checkboxLeft: {
        marginLeft: '-48px',
        marginTop: '2px',
        position: 'absolute',
        border: '0',
        color: theme.palette.text.primary,
    },
    inactive: {
        color: theme.palette.text.disabled
    },
    missingDefault: {
        color: theme.palette.text.secondary
    },
    missingDefaultCounterpart: {
        backgroundColor: theme.palette.delete.main,
        color: theme.palette.getContrastText(theme.palette.delete.main),
    },
    toBePublished: {
        '&:hover': {
            backgroundColor: fade(theme.palette.publish.main, 0.7)
        },
        backgroundColor: theme.palette.publish.main,
        color: theme.palette.getContrastText(theme.palette.publish.main),
    },
    highlightText: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    publishedCheck: {
        color: theme.palette.enabled.main,
    },
    moveAction: {
        color: theme.palette.secondary.main,
    },
    deleteAction: {
        color: theme.palette.delete.main,
    },
    textInput: {
        color: "inherit",
        fontSize: "inherit",
        width: "100%"
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
        paddingBottom: "10px",
        textTransform: "uppercase"
    },
    text: {
        width: "260px"
    }
});

class VanityUrlListDefault extends React.Component {

    constructor(props) {
        super(props);
    }

    onMappingChanged(urlPair, actions, value, onSuccess, onError) {
        actions.updateVanity.call({urlPair: urlPair, url: value}, onSuccess, onError);
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
                <Paper elevation={2}>
                    <Table className={classes.table}>

                        <TableBody data-vud-table-body-default={contentUuid}>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.default;
                                let selected = !!(_.find(selection, (p)=> p.uuid === urlPair.uuid));
                                if (url) {
                                    let classInactive = (url.active ? '' : classes.inactive);
                                    let isPublished = url.publicationInfo.publicationStatus === 'PUBLISHED';

                                    return (
                                        <TableRow key={urlPair.uuid} hover classes={{
                                            root: classes.vanityUrl,
                                            hover: (isPublished ? '' : classes.toBePublished)
                                        }}  onClick={() => onChangeSelection(!selected, [urlPair])}
                                       		data-vud-url={url.url}>
                                            <TableCell padding={'none'} className={(checkboxesDisplayed ? (expanded ? '' : classes.hidden) : (classes.hiddenOnHover)) + ' ' + classes.checkboxLeft}>
                                                <Checkbox onClick={(event) => {event.stopPropagation()}} checked={selected} onChange={(event, checked) => onChangeSelection(checked, [urlPair])}/>
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                <Switch onClick={(event) => {event.stopPropagation()}} onChange={(event) => actions.updateVanity.call({urlPair: urlPair, active: event.target.checked}, event)} checked={url.active} data-vud-role="action-active"/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive + ' ' + classes.tableCellTextInput}>
                                                <Editable value={url.url}
                                                          render={  (props) => (this.props.filterText ? <HighlightText text={props.value} highlight={this.props.filterText} classes={classes}/> : <Typography className={classes.text} noWrap={true}>{props.value}</Typography>) }
                                                          input={ ({onSave, onCancel, onRef, ...props}) => <TextField {...props}
                                                                                                     onBlur={(e)=>{onSave(e)}}
                                                                                                     onKeyUp={(e)=>{if (e.key === 'Enter') { onSave(e) } else if (e.key === 'Escape') { onCancel(e) } }}
                                                                                                     InputProps={{ classes:{root:classes.textInput}}} inputProps={{ref:onRef}}/> }
                                                          onChange={ this.onMappingChanged.bind(this, urlPair, actions) } />
                                            </TableCell>
                                            <TableCell padding={'none'} className={classes.hiddenOnHover + ' ' + classInactive}>
                                                {selection.length === 0 ? (
                                                    <span>
                                                        <ActionButton role='action-delete' className={isPublished ? classes.deleteAction : ''} action={actions.deleteAction} data={[urlPair]}/>
                                                        <ActionButton role="action-move" className={isPublished ? classes.moveAction : ''} action={actions.moveAction} data={[urlPair]}/>
                                                    </span>
                                                ) : ''}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                <Checkbox className={url.default ? '' : classes.hiddenOnHover} onClick={(event) => {event.stopPropagation()}} checked={url.default} icon={<StarBorder/>} checkedIcon={<Star/>} onChange={(event) => actions.updateVanity.call({urlPair: urlPair, defaultMapping: event.target.checked}, event)}
                                                	data-vud-role="action-default"/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                <LanguageMenu languageCode={urlPair.default.language} languages={languages} onLanguageSelected={(languageCode) => actions.updateVanity.call({urlPair: urlPair, language: languageCode})}/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive} style={{textAlign: 'center'}}>
                                                {isPublished ? (
                                                    <Done classes={{root: classes.publishedCheck}}/>
                                                ) : (
                                                    <ActionButton role="action-publish" action={actions.publishAction} data={[urlPair]}/>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl}>
                                            <TableCell colSpan={7} padding={'dense'} className={classes.missingDefault}>
                                                {urlPair.live && urlPair.live.editNode ? (
                                                        t('label.movedDefault', {page: urlPair.live.editNode.targetNode.displayName})
                                                    ) :
                                                    t('label.missingDefault', {vanityUrl: urlPair.live.url})
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
                <Paper elevation={2}>
                    <Table className={classes.table}>
                        <TableBody data-vud-table-body-live={contentUuid}>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.live;
                                if (url) {
                                    let classInactive = (url.active ? '' : classes.inactive);
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl + ' ' + ((urlPair.default  && !_.includes(defaultNotPublished, url)) ? '' : classes.missingDefaultCounterpart)}>
                                            <TableCell padding={'dense'} className={classInactive}>
                                                {this.props.filterText ? <HighlightText text={url.url} highlight={this.props.filterText} classes={classes}/> : <Typography className={classes.text} noWrap={true}>{url.url}</Typography>}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                {url.default ? <Star color={url.active ? 'secondary' : 'disabled'}/> : ''}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                {url.language}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive} style={{textAlign: 'center'}}>
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
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl}>
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
