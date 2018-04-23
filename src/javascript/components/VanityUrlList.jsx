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
        paddingBottom: "10px"
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

        let { vanityUrls, classes, t, selection, onChangeSelection, expanded, actions, languages } = this.props;
        let urlPairs = _.filter(vanityUrls, (urlPair) => urlPair.default);

        let allCheckboxChecked = false;
        let allCheckboxIndeterminate = false;
        if (urlPairs.length > 0) {
            allCheckboxChecked = _.differenceBy(urlPairs, selection, "uuid").length === 0;
            allCheckboxIndeterminate = !allCheckboxChecked && _.intersectionBy(urlPairs, selection, "uuid").length > 0;
        }

        return (
            <div>
                <div>
                    {urlPairs.length > 0 ? (
                        <Checkbox className={((allCheckboxChecked || allCheckboxIndeterminate) ? (expanded ? '' : classes.hidden) : (classes.hiddenOnHover)) + ' ' + classes.allCheckbox} checked={allCheckboxChecked} indeterminate={allCheckboxIndeterminate}
                                  onChange={(event, checked) => onChangeSelection(checked, urlPairs)}
                        />
                    ) : ''}
                    <Typography variant="caption" classes={{caption: classes.tableTitle}}>
                        {t('label.mappings.default')}
                    </Typography>
                </div>
                <Paper elevation={2}>
                    <Table className={classes.table}>

                        <TableBody>
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
                                        }}  onClick={(event) => onChangeSelection(!selected, [urlPair])}>
                                            <TableCell padding={'none'} className={(selected ? (expanded ? '' : classes.hidden) : (classes.hiddenOnHover)) + ' ' + classes.checkboxLeft}>
                                                <Checkbox onClick={(event) => {event.stopPropagation()}} checked={selected} onChange={(event, checked) => onChangeSelection(checked, [urlPair])}/>
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                <Switch onClick={(event) => {event.stopPropagation()}} onChange={(event) => actions.updateVanity.call({urlPair: urlPair, active: event.target.checked}, event)} checked={url.active} />
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                <Editable value={url.url}
                                                          render={  (props) => (this.props.filterText ? <HighlightText text={props.value} highlight={this.props.filterText} classes={classes}/> : <span>{props.value}</span>) }
                                                          input={ ({onSave, ...props}) => <Input {...props} onBlur={(e)=>onSave(e)} onKeyPress={(e)=>{if (e.key === 'Enter') { onSave(e) } }} classes={ {root:classes.textInput}}/> }
                                                          onChange={ this.onMappingChanged.bind(this, urlPair, actions) } />
                                            </TableCell>
                                            <TableCell padding={'none'} className={classes.hiddenOnHover + ' ' + classInactive}>
                                                {selection.length === 0 ? (
                                                    <span>
                                                        <ActionButton className={isPublished ? classes.deleteAction : ''} action={actions.deleteAction} data={[urlPair]}/>
                                                        <ActionButton className={isPublished ? classes.moveAction : ''} action={actions.moveAction} data={[urlPair]}/>
                                                    </span>
                                                ) : ''}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                <Checkbox className={url.default ? '' : classes.hiddenOnHover} onClick={(event) => {event.stopPropagation()}} checked={url.default} icon={<StarBorder/>} checkedIcon={<Star/>} onChange={(event) => actions.updateVanity.call({urlPair: urlPair, defaultMapping: event.target.checked}, event)}/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                <LanguageMenu languageCode={urlPair.default.language} languages={languages} onLanguageSelected={(languageCode) => actions.updateVanity.call({urlPair: urlPair, language: languageCode})}/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive} style={{textAlign: 'center'}}>
                                                {isPublished ? (
                                                    <Done classes={{root: classes.publishedCheck}}/>
                                                ) : (
                                                    <ActionButton action={actions.publishAction} data={[urlPair]}/>
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
        let { vanityUrls, classes, t, actions } = this.props;
        let deletedUrls = _.filter(vanityUrls, (urlPair) => urlPair.live && !urlPair.live.editNode);
        return (
            <div>
                <div>
                    <Typography variant="caption" classes={{caption: classes.tableTitle}}>
                        {t('label.mappings.live')}
                    </Typography>
                </div>
                <Paper elevation={2}>
                    <Table className={classes.table}>
                        <TableBody>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.live;
                                if (url) {
                                    let classInactive = (url.active ? '' : classes.inactive);
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl + ' ' + (urlPair.default ? '' : classes.missingDefaultCounterpart)}>
                                            <TableCell padding={'dense'} className={classInactive}>
                                                {this.props.filterText ? <HighlightText text={url.url} highlight={this.props.filterText} classes={classes}/> : url.url}
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
                                                        <ActionButton action={actions.moveInfo} data={url.editNode.targetNode.path}/> :
                                                        '')
                                                    :
                                                    <ActionButton action={actions.publishDeleteAction} data={deletedUrls}/>
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
        let {action, data, className} = this.props;
        return (
            <IconButton className={className} aria-label={action.buttonLabel} onClick={(event) => {
                event.stopPropagation();
                action.call(data, event);
            }}>
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
    translate('site-settings-seo')
)(VanityUrlListDefault);

VanityUrlListLive = compose(
    withStyles(styles),
    translate('site-settings-seo')
)(VanityUrlListLive);

export {VanityUrlListLive};
export {VanityUrlListDefault};
