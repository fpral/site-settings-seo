import React from 'react';
import {translate} from 'react-i18next';
import {
    Checkbox,
    IconButton,
    Paper,
    Switch,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    withStyles
} from 'material-ui';
import {
    Done,
    Star,
    StarBorder
} from 'material-ui-icons';
import * as _ from "lodash";
import {fade} from "material-ui/styles/colorManipulator";

const styles = (theme) => ({
    boxTitle: {
        padding: theme.spacing.unit
    },
    vanityUrl: {
        '&:hover $hiddenOnHover': {
            transition: ["opacity","0.25s"],
            opacity:1
        },
        height: '52px'
    },
    hidden: {
        opacity:0
    },
    hiddenOnHover: {
        opacity:0,
        transition: ["opacity","0.25s"],
    },
    checkboxLeft: {
        marginLeft: '-48px',
        marginTop: '2px',
        position: 'absolute',
        border: '0'
    },
    inactive: {
        color: theme.palette.text.disabled
    },
    missingDefault: {
        color: theme.palette.text.secondary
    },
    missingDefaultCounterpart: {
        backgroundColor: theme.palette.error.light
    },
    toBePublished: {
        '&:hover': {
            backgroundColor: fade(theme.palette.warning.light, 0.7)
        },
        backgroundColor: theme.palette.warning.light
    },
    highlightText: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    publishedCheck: {
        color: theme.palette.success.main,
    }
});

class VanityUrlListDefault extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { vanityUrls, classes, t, selection, onChangeSelection, expanded, actions } = this.props;
        let urlPairs = _.filter(vanityUrls, (urlPair) => urlPair.default);
        let allCheckboxChecked = _.differenceBy(urlPairs, selection, "uuid").length === 0;
        let allCheckboxIndeterminate = !allCheckboxChecked && _.intersectionBy(urlPairs, selection, "uuid").length > 0;

        return (
            <div>
                <Paper elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow className={classes.vanityUrl}>
                                <TableCell padding={'none'} className={((allCheckboxChecked || allCheckboxIndeterminate) ? (expanded ? '' : classes.hidden) : (classes.hiddenOnHover)) + ' ' + classes.checkboxLeft}>
                                    <Checkbox checked={allCheckboxChecked} indeterminate={allCheckboxIndeterminate}
                                              onChange={(event, checked) => onChangeSelection(checked, urlPairs)}
                                    />
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
                                                <Switch onClick={(event) => {event.stopPropagation()}} onChange={(event) => actions.setActiveAction.call({urlPair:urlPair, active:event.target.checked}, event)} checked={url.active} />
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                {this.props.filterText ? <HighlightText text={url.url} higlight={this.props.filterText}/> : url.url}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classes.hiddenOnHover + ' ' + classInactive}>
                                                {selection.length === 0 ? (
                                                    <span>
                                                        <ActionButton action={actions.deleteAction} data={[urlPair]}/>
                                                        <ActionButton action={actions.moveAction} data={[urlPair]}/>
                                                    </span>
                                                ) : ''}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                <Checkbox onClick={(event) => {event.stopPropagation()}} checked={url.default} icon={<StarBorder/>} checkedIcon={<Star/>} onChange={(event) => actions.setDefaultAction.call([urlPair], event)}/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive}>
                                                {url.language}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classInactive} style={{textAlign: 'center'}}>
                                                {isPublished ? (
                                                    <Done classes={{root: classes.publishedCheck}}/>
                                                ) : (
                                                    <ActionButton action={actions.publishActionIcon} data={[urlPair]}/>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl}>
                                            <TableCell colSpan={7} padding={'dense'} className={classes.missingDefault}>
                                                {urlPair.live && urlPair.live.editNode ? (
                                                        t('label.movedDefault', {page: urlPair.live.editNode.parent.parent.displayName})
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
                    <Table>
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
                                                        <ActionButton action={actions.moveInfo} data={url.editNode.parent.parent.path}/> :
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
        let action = this.props.action;
        let data = this.props.data;
        return (
            <IconButton aria-label={action.buttonLabel} style={{color: action.tableColor}} onClick={(event) => {
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
