import React from 'react';
import { withStyles } from 'material-ui/styles';
import Input, { InputAdornment } from 'material-ui/Input';
import { Search } from 'material-ui-icons';

const styles = theme => ({
    root: {
        position: 'absolute',
        'right': '20px',
        'color': 'inherit',
        'bottom': '10px',
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
        'marginBottom': 'auto'
    }
});

class SearchField extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onChangeFilter(event.target.value);
    };

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