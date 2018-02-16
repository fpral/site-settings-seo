import React from 'react';
import {
    Collapse,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    withStyles
} from 'material-ui';


import {Check, ExpandLess, ExpandMore, Star} from 'material-ui-icons'
import {Pagination} from "./Pagination";
import {PickerViewMaterial, withPickerModel} from '@jahia/react-dxcomponents';
import {translate} from 'react-i18next';


const styles = theme => ({
    root: {
        margin: theme.spacing.unit,
        backgroundColor: "white"
    },

    nested: {
        paddingLeft: 64,
        padding: 16
    }

});

class VanityUrlTableView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openedItems: {}
        };

    }

    handleOpenDialog = (path) => {
        this.setState({open: true, path: path});
    };

    handleCloseDialog = () => {
        this.setState({open: false});
    };

    handleItemClick = (uuid) => {
        let st = this.state.openedItems;
        st[uuid] = !st[uuid];
        this.setState({openedItems: st})
    };

    render() {
        const {rows, t, classes} = this.props;

        return (
            <div>
                <List>
                    {rows.map(row => (
                        <div key={row.uuid} className={classes.root}>
                            <ListItem button onClick={() => this.handleItemClick(row.uuid)} >
                                <ListItemIcon>{this.state.openedItems[row.uuid] ? <ExpandLess/> :
                                    <ExpandMore/>}</ListItemIcon>
                                <ListItemText inset primary={row.displayName}  secondary={row.path}/>
                            </ListItem>
                            <Collapse in={this.state.openedItems[row.uuid]} timeout="auto" unmountOnExit>
                                <div >
                                    <Grid container spacing={24} className={classes.nested}>
                                        <Grid item xs={12} lg={6}>
                                            <Typography variant="title" >
                                                Default
                                            </Typography>
                                            <Paper elevation={4}>
                                                <Table>
                                                    <TableBody>
                                                        {row.defaultUrls.map(url => (
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
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <Typography variant="title" >
                                                Live
                                            </Typography>

                                            <Paper elevation={4}>
                                                <Table>
                                                    <TableBody>
                                                        {row.liveUrls.map(url => (
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
                                        </Grid>
                                    </Grid>
                                </div>
                            </Collapse>
                        </div>))
                    }
                </List>
                <Pagination {...this.props} />
            </div>
        )
    }
}

VanityUrlTableView = withStyles(styles)(translate('site-settings-seo')(VanityUrlTableView));

export {VanityUrlTableView};
