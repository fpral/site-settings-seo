import React from 'react';
import {translate} from 'react-i18next';
import {VanityUrl} from './VanityUrl';

import {
    Paper,
    Table,
    TableBody,
    Typography
} from 'material-ui';

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
                            {this.props.vanityUrls.map(url => (<VanityUrl url={url}/>))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

VanityUrlList = translate('site-settings-seo')(VanityUrlList);

export {VanityUrlList};
