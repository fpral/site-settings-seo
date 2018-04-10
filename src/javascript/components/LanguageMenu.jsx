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

    handleSelect(languageCode, event) {
        this.handleClose(event);
        this.props.onLanguageSelected(languageCode);
    };

    render() {

        const { anchorEl } = this.state;
        const { languageCode, languages, classes } = this.props;

        return (<div>
            <Button className={classes.langButton} onClick={this.handleClick}>
                {languageCode}
                <ArrowDropDown className={classes.rightIcon}/>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                {languages.map(language => <MenuItem key={language.code} onClick={(event) => this.handleSelect(language.code, event)}>{language.name} ({language.code})</MenuItem>)}
            </Menu>
        </div>)
    }
}

LanguageMenu = withStyles(styles)(LanguageMenu);

export {LanguageMenu};
