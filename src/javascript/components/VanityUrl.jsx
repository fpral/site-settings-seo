import React from 'react';

import {
    TableCell,
    TableRow
} from 'material-ui';

import {
    Check,
    Star
} from 'material-ui-icons';

class VanityUrl extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let url = this.props.url;
        return (
            <TableRow key={url.url}>
                <TableCell>{url.active ? <Check/> : <div/>}</TableCell>
                <TableCell>{url.url}</TableCell>
                <TableCell>{url.default ? <Star/> : <div/>}</TableCell>
                <TableCell>{url.language}</TableCell>
            </TableRow>
        );
    }
}

export {VanityUrl};
