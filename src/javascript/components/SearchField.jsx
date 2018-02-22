import React from 'react';
import { withStyles } from 'material-ui/styles';
import Input, { InputAdornment } from 'material-ui/Input';
import { Search } from 'material-ui-icons';

const styles = theme => ({
    root: {
        position: 'absolute',
        'right': '20px',
    },
    searchInput: {
        color: 'white',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '& :focus':  {
            width: '300px'
        },
    },
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
            <div className={classes.root}>
                <Input className={classes.searchInput}
                       onChange={this.handleChange}
                       type="text"
                       startAdornment={<InputAdornment position="start"><Search/></InputAdornment>}
                />
            </div>
        )
    }
}

SearchField =  withStyles(styles)(SearchField);

export {SearchField};