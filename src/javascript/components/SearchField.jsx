import React from 'react';
import { withStyles } from 'material-ui/styles';
import Input, { InputAdornment } from 'material-ui/Input';
import { Search } from 'material-ui-icons';

const styles = theme => ({
    root: {
        position: 'absolute',
        'right': '20px',
        'color' : 'inherit',
        backgroundColor : 'rgba(114, 139, 150, 1.00)',
        'bottom': '16px',
    },
    input: {
        transitionProperty: 'width',
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: '0ms',
        width: '200px',
        '&:focus': {
            width: '300px',
        }
    },
    searchIcon: {
        'marginTop': 'auto',
        'marginBottom': 'auto',
        'paddingLeft': '6px'
    }
});

class SearchField extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.doSearch = true;
    }

    handleChange(event) {
        if (!this.doSearch || event.target.value.length < 2) {
            return;
        }
        this.props.onChangeFilter(event.target.value)
        this.doSearch = false;
        // wait for 200 ms before next search
        setTimeout(function() {
            this.doSearch = true;
        }.bind(this), 200);
    }

    render() {

        const { classes } = this.props;

        return (
            <div>
                <Input classes={{root: classes.root, input: classes.input}}
                       onChange={this.handleChange}
                       type="text"
                       startAdornment={<InputAdornment classes={{root: classes.searchIcon}} position="start"><Search/></InputAdornment>}
                />
            </div>
        )
    }
}

SearchField =  withStyles(styles)(SearchField);

export {SearchField};