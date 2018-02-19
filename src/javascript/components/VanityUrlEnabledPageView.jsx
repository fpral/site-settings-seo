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

import {
    Check,
    ExpandLess,
    ExpandMore,
    Star
} from 'material-ui-icons';

class VanityUrlEnabledPageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleItemClick = () => {
        this.setState({open: !this.state.open});
    };

    render() {
        let page = this.props.page;
        return (
                <div className={this.props.classes.root}>
                <ListItem button onClick={() => this.handleItemClick()} >
                    <ListItemIcon>{this.state.open ? <ExpandLess/> : <ExpandMore/>}</ListItemIcon>
                    <ListItemText inset primary={page.displayName} secondary={page.path}/>
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <div >
                        <Grid container spacing={24} className={this.props.classes.nested}>
                            <Grid item xs={12} lg={6}>
                                <Typography variant="title" >
                                    Default
                                </Typography>
                                <Paper elevation={4}>
                                    <Table>
                                        <TableBody>
                                            {page.defaultUrls.map(url => (
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
                                            {page.liveUrls.map(url => (
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
            </div>
        );
    }
}

export {VanityUrlEnabledPageView};
