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
    withStyles
} from 'material-ui';
import {Done, Star, StarBorder} from 'material-ui-icons';
import {LanguageMenu} from "./LanguageMenu";
import * as _ from "lodash";
import {fade} from "material-ui/styles/colorManipulator";

const styles = (theme) => ({
    boxTitle: {
        padding: theme.spacing.unit
    },
    vanityUrl: {
        '&:hover $hiddenOnHover': {
            transition: ["opacity", "0.25s"],
            opacity: 1
        },
        height: '52px'
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
});

class VanityUrlListDefault extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { vanityUrls, classes, t, selection, onChangeSelection, expanded, actions, languages } = this.props;
        let urlPairs = _.filter(vanityUrls, (urlPair) => urlPair.default);
        let allCheckboxChecked = urlPairs.length > 0 && _.differenceBy(urlPairs, selection, "uuid").length === 0;
        let allCheckboxIndeterminate = !allCheckboxChecked && _.intersectionBy(urlPairs, selection, "uuid").length > 0;

        return (
            <div>
                <Paper elevation={2}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow className={classes.vanityUrl}>
                                <TableCell padding={'none'} className={((allCheckboxChecked || allCheckboxIndeterminate) ? (expanded ? '' : classes.hidden) : (classes.hiddenOnHover)) + ' ' + classes.checkboxLeft}>
                                    {urlPairs.length > 0 ? (
                                        <Checkbox checked={allCheckboxChecked} indeterminate={allCheckboxIndeterminate}
                                                  onChange={(event, checked) => onChangeSelection(checked, urlPairs)}
                                        />
                                    ) : ''}
                                </TableCell>
                                <TableCell padding={'none'} colSpan={6}>
                                    <Typography variant="caption" classes={{caption: classes.boxTitle}} >
                                        {t('label.mappings.default')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
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
                                                <Switch onClick={(event) => {event.stopPropagation()}} onChange={(event) => actions.setActiveAction.call({urlPair: urlPair, active: event.target.checked}, event)} checked={url.active} />
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                {this.props.filterText ? <HighlightText text={url.url} higlight={this.props.filterText}/> : url.url}
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
                                                <Checkbox className={url.default ? '' : classes.hiddenOnHover} onClick={(event) => {event.stopPropagation()}} checked={url.default} icon={<StarBorder/>} checkedIcon={<Star/>} onChange={(event) => actions.setDefaultAction.call({urlPair: urlPair, defaultUrl: event.target.checked}, event)}/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                <LanguageMenu languages={languages} urlPair={urlPair} action={actions.setLanguageAction}/>
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
    }

    render() {
        let { vanityUrls, classes, t, actions } = this.props;
        return (
            <div>
                <Paper elevation={2}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding={'none'} colSpan={4}>
                                    <Typography variant="caption" className={classes.boxTitle} >
                                        {t('label.mappings.live')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.live;
                                if (url) {
                                    let classInactive = (url.active ? '' : classes.inactive);
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl + ' ' + (urlPair.default ? '' : classes.missingDefaultCounterpart)}>
                                            <TableCell padding={'dense'} className={classInactive}>
                                                {this.props.filterText ? <HighlightText text={url.url} higlight={this.props.filterText}/> : url.url}
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
                                                    <ActionButton action={actions.publishDeleteAction} data={[urlPair]}/>
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
        let highlight = this.props.higlight;
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

VanityUrlListDefault = withStyles(styles)(translate('site-settings-seo')(VanityUrlListDefault));
VanityUrlListLive = withStyles(styles)(translate('site-settings-seo')(VanityUrlListLive));
HighlightText = withStyles(styles)(HighlightText);

export {VanityUrlListLive};
export {VanityUrlListDefault};
