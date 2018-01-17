import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from 'material-ui';

import {PickerViewMaterial, withPickerModel} from '@jahia/react-dxcomponents';
import * as _ from "lodash";

class VanityUrlsTableView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

    }

    handleOpen = (path) => {
        this.setState({open: true, path: path});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        let Picker = withPickerModel(["displayName"], "pageSelector")(PickerViewMaterial);
        return (
            <div>
                <div>
                    {_.range(this.props.numberOfPages).map(i => (
                        <Button key={i + 1}
                                onClick={() => this.props.onSelectPage(i)}>{i + 1}</Button>))}
                </div>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Page</TableCell>
                            <TableCell>Mappings</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {this.props.rows.map(row => (
                            <TableRow key={row.uuid}>
                                <TableCell>{row.displayName} {row.path}</TableCell>
                                <TableCell>
                                    <Table>
                                        <TableBody>
                                            {row.urls.map(url => (
                                                <TableRow key={url.url}>
                                                    <TableCell>{url.url}</TableCell>
                                                    <TableCell>{url.language}</TableCell>
                                                    <TableCell>{url.active}</TableCell>
                                                    <TableCell>{url.default}</TableCell>
                                                    <TableCell><Button onClick={() => this.handleOpen(row.path)}>Select</Button></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Select page</DialogTitle>
                    <Picker rootPaths={["/sites"]}
                            openPaths={["/sites",this.state.path]}
                            selectedPaths={[this.state.path]}
                            openableTypes={['jnt:page','jnt:virtualsite','jnt:virtualsitesFolder','jnt:content']}
                            selectableTypes={['jnt:page','jnt:content']}
                            queryVariables={{lang:contextJsParameters.uilang}}
                            textRenderer={(entry) => entry.node.displayName}
                    />
                    <DialogActions>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        <Button onClick={this.handleClose}>Submit</Button>
                    </DialogActions>
                </Dialog>


            </div>
        )
    }
};

export {VanityUrlsTableView};
