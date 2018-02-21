import React from 'react';
import {translate} from 'react-i18next';

import {Paper, Switch, Table, TableBody, TableCell, TableRow, Typography, withStyles} from 'material-ui';

import {CheckBoxOutlineBlank, Star} from 'material-ui-icons';

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
    hiddenOnHover: {
        opacity:0,
        transition: ["opacity","0.25s"],
    },
    checkboxLeft: {
        marginLeft: '-48px',
        marginTop: '12px',
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
    }
});

class VanityUrlListDefault extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { vanityUrls, classes, t } = this.props;
        return (
            <div>
                <Typography type="caption" className={classes.boxTitle} >
                    {t('label.mappings.default')}
                </Typography>
                <Paper elevation={4}>
                    <Table>
                        <TableBody>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.default;
                                if (url) {
                                    return (
                                        <TableRow key={urlPair.uuid} hover classes={{root: classes.vanityUrl}}>
                                            <TableCell padding={'none'} className={_.join([classes.hiddenOnHover, classes.checkboxLeft], ' ')}>
                                                <CheckBoxOutlineBlank/>
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                <Switch checked={url.active} color="primary"/>
                                            </TableCell>
                                            <TableCell padding={'none'} className={url.active ? '' : classes.inactive}>
                                                {url.url}
                                            </TableCell>
                                            <TableCell padding={'none'} className={classes.hiddenOnHover}>
                                                [Actions]
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                {url.default ? <Star/> : <div/>}
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                {url.language}
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl}>
                                            <TableCell colSpan={6} padding={'dense'} className={classes.missingDefault}>
                                                {t('label.missingDefault', {vanityUrl: urlPair.live.url})}
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
        let { vanityUrls, classes, t } = this.props;
        return (
            <div>
                <Typography type="caption" className={classes.boxTitle} >
                    {t('label.mappings.live')}
                </Typography>
                <Paper elevation={4}>
                    <Table>
                        <TableBody>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.live;
                                if (url) {
                                    return (
                                        <TableRow key={urlPair.uuid} className={_.join([classes.vanityUrl, (urlPair.default ? '' : classes.missingDefaultCounterpart)], ' ')}>
                                            <TableCell padding={'dense'} className={url.active ? '' : classes.inactive}>
                                                {url.url}
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                {url.default ? <Star/> : <div/>}
                                            </TableCell>
                                            <TableCell padding={'none'}>
                                                {url.language}
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={urlPair.uuid} className={classes.vanityUrl}>
                                            <TableCell colSpan={3} padding={'none'}>
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

VanityUrlListDefault = withStyles(styles)(translate('site-settings-seo')(VanityUrlListDefault));
VanityUrlListLive = withStyles(styles)(translate('site-settings-seo')(VanityUrlListLive));

export {VanityUrlListLive};
export {VanityUrlListDefault};
