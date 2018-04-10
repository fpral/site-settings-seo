import React from 'react';
import {Button, Menu, MenuItem, withStyles} from 'material-ui';
import {ArrowDropDown} from 'material-ui-icons';

const styles = (theme) => ({
    langButton: {
        '&:hover $rightIcon': {
            transition: ["opacity", "0.25s"],
            opacity: 1
        },
        '&:hover': {
            backgroundColor: "#fff"
        }
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
        opacity: 0
    }
});

class LanguageMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose(event) {
        event.stopPropagation();
        this.setState({anchorEl: null});
    };

    handleSelect(language, event) {
        this.handleClose(event);
        const { action, urlPair } = this.props;
        action.call({urlPair: urlPair, language: language})
    };

    render() {

        const { anchorEl } = this.state;
        const { urlPair, languages, classes } = this.props;

        return (<div>
            <Button className={classes.langButton} onClick={this.handleClick}>
                {urlPair.default.language}
                <ArrowDropDown className={classes.rightIcon}/>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                {languages.map(language => <MenuItem key={language.language} onClick={(event) => this.handleSelect(language.language, event)}>{language.displayName} ({language.language})</MenuItem>)}
            </Menu>
        </div>)
    }
}

LanguageMenu = withStyles(styles)(LanguageMenu);

export {LanguageMenu};
