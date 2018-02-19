import React from 'react';
import {translate} from 'react-i18next';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from 'material-ui';

import {
    Check,
    Star
} from 'material-ui-icons';

class VanityUrlList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Typography variant="title" >
                    {this.props.t('label.mappings.' + this.props.workspace)}
                </Typography>
                <Paper elevation={4}>
                    <Table>
                        <TableBody>
                            {this.props.vanityUrls.map(url => (
                                <TableRow key={url.url}>
                                    <TableCell>{url.url}</TableCell>
                                    <TableCell>{url.language}</TableCell>
                                    <TableCell>{url.active ? <Check/> : <div/>}</TableCell>
                                    <TableCell>{url.default ? <Star/> : <div/>}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

VanityUrlList = translate('site-settings-seo')(VanityUrlList);

export {VanityUrlList};
