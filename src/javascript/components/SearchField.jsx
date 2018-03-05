import React from 'react';
import { withStyles } from 'material-ui/styles';
import Input, { InputAdornment } from 'material-ui/Input';
import { Search } from 'material-ui-icons';

const styles = theme => ({
    root: {
        position: 'absolute',
        'right': '20px',
        'color' : 'inherit',
        backgroundColor : theme.palette.primary.light,
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
    }

    handleChange(event) {
        // Let the handler deal with the change only when the user has paused changing the filter text for a second.
        event.persist();
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(function() {
            this.props.onChangeFilter(event.target.value)
        }.bind(this), 1000);
    }

    render() {

        const { classes } = this.props;

        return (
            <div>
                <Input classes={{root: classes.root, input: classes.input}}
                       onChange={this.handleChange}
                       disableUnderline={true}
                       type="text"
                       startAdornment={<InputAdornment classes={{root: classes.searchIcon}} position="start"><Search/></InputAdornment>}
                />
            </div>
        )
    }
}

SearchField =  withStyles(styles)(SearchField);

export {SearchField};