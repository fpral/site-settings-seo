import React from 'react';
import {Dialog, FlatButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui';

import {Picker, muiTheme} from '@jahia/react-dxcomponents';
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
        return (
            <div>
                <div>
                    {_.range(this.props.numberOfPages).map(i => (
                        <FlatButton key={i + 1} label={i + 1} primary={this.props.currentPage === i}
                                    onClick={() => this.props.onSelectPage(i)}/>))}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Page</TableHeaderColumn>
                            <TableHeaderColumn>Mappings</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {this.props.rows.map(row => (
                            <TableRow key={row.uuid}>
                                <TableRowColumn>{row.displayName} {row.path}</TableRowColumn>
                                <TableRowColumn>
                                    <Table selectable={false}>
                                        <TableBody displayRowCheckbox={false}>
                                            {row.urls.map(url => (
                                                <TableRow key={url.url}>
                                                    <TableRowColumn>{url.url}</TableRowColumn>
                                                    <TableRowColumn>{url.language}</TableRowColumn>
                                                    <TableRowColumn>{url.active}</TableRowColumn>
                                                    <TableRowColumn>{url.default}</TableRowColumn>
                                                    <TableRowColumn><FlatButton label="Select" onClick={() => this.handleOpen(row.path)}/></TableRowColumn>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Dialog
                    title="Dialog With Actions"
                    actions={[
                        <FlatButton label="Cancel" primary={true} onClick={this.handleClose}/>,
                        <FlatButton label="Submit" primary={true} keyboardFocused={true} onClick={this.handleClose}/>
                    ]}
                    modal={false}
                    open={this.state.open}
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    repositionOnUpdate={false}
                    contentStyle={{width: "100%", maxWidth: "none"}}
                    style={{paddingTop:"0px"}}
                    onRequestClose={this.handleClose}
                >
                    <Picker id="pageSelector"
                            rootPaths={["/sites"]}
                            openPaths={["/sites",this.state.path]}
                            selectedPath={this.state.path}
                            openableTypes={['jnt:page','jnt:virtualsite','jnt:virtualsitesFolder','jnt:content']}
                            selectableTypes={['jnt:page','jnt:content']}
                            fragments={["displayName"]}
                            variables={{lang:contextJsParameters.uilang}}
                            textRenderer={(entry) => entry.node.displayName}
                    />
                </Dialog>

            </div>
        )
    }
};

export {VanityUrlsTableView};
