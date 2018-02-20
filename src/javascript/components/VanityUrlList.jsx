import React from 'react';
import {translate} from 'react-i18next';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from 'material-ui';

import {
    Check,
    Star
} from 'material-ui-icons';

class VanityUrlListDefault extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Typography variant="title" >
                    {this.props.t('label.mappings.default')}
                </Typography>
                <Paper elevation={4}>
                    <Table>
                        <TableBody>
                            {this.props.vanityUrls.map(urlPair => {
                                let url = urlPair.default;
                                if (url) {
                                    return (
                                        <TableRow>
                                            <TableCell>{url.active ? <Check/> : <div/>}</TableCell>
                                            <TableCell>{url.url}</TableCell>
                                            <TableCell>{url.default ? <Star/> : <div/>}</TableCell>
                                            <TableCell>{url.language}</TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={4}>{/*Not there anymore (deleted or moved)*/}</TableCell>
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
                                            <TableCell>{url.url}</TableCell>
                                            <TableCell>{url.default ? <Star/> : <div/>}</TableCell>
                                            <TableCell>{url.language}</TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={4}>{/*Not there anymore (deleted or moved)*/}</TableCell>
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

VanityUrlListDefault = translate('site-settings-seo')(VanityUrlListDefault);
VanityUrlListLive = translate('site-settings-seo')(VanityUrlListLive);

export {VanityUrlListLive};
export {VanityUrlListDefault};
