import React from 'react';
import {translate} from 'react-i18next';

import {Paper, Switch, Table, TableBody, TableCell, TableRow, Typography, withStyles} from 'material-ui';

import {CheckBoxOutlineBlank, Star} from 'material-ui-icons';

const styles = (theme) => ({
    root: {
        '&:hover $hiddenOnHover': {
            transition: ["opacity","0.25s"],
            opacity:1
        }
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
                <Typography variant="title" >
                    {t('label.mappings.default')}
                </Typography>
                <Paper elevation={4}>
                    <Table>
                        <TableBody>
                            {vanityUrls.map(urlPair => {
                                let url = urlPair.default;
                                if (url) {
                                    return (
                                        <TableRow hover classes={{root:classes.root}}>
                                            <TableCell padding={'none'} className={_.join([classes.hiddenOnHover,classes.checkboxLeft],' ')}><CheckBoxOutlineBlank/></TableCell>
                                            <TableCell padding={'none'}><Switch checked={url.active} color="primary"></Switch>{url.url}</TableCell>
                                            <TableCell padding={'none'} className={classes.hiddenOnHover}>[Actions]</TableCell>
                                            <TableCell padding={'none'}>{url.default ? <Star/> : <div/>}</TableCell>
                                            <TableCell padding={'none'}>{url.language}</TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={6}>{/*Not there anymore (deleted or moved)*/}</TableCell>
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
        return (
            <div>
                <Typography variant="title" >
                    {this.props.t('label.mappings.live')}
                </Typography>
                <Paper elevation={4}>
                    <Table>
                        <TableBody>
                            {this.props.vanityUrls.map(urlPair => {
                                let url = urlPair.live;
                                if (url) {
                                    return (
                                        <TableRow>
                                            <TableCell padding={'dense'}>{url.url}</TableCell>
                                            <TableCell padding={'none'}>{url.default ? <Star/> : <div/>}</TableCell>
                                            <TableCell padding={'none'}>{url.language}</TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={3}>{/*Not published yet */}</TableCell>
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
VanityUrlListLive = translate('site-settings-seo')(VanityUrlListLive);

export {VanityUrlListLive};
export {VanityUrlListDefault};
