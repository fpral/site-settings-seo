import React from 'react';
import {Button, Menu, MenuItem} from '@material-ui/core';
import {ArrowDropDown} from '@material-ui/icons';

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
        const { languageCode, languages } = this.props;

        return (<React.Fragment>
            <Button size={'small'} onClick={this.handleClick} data-vud-role="language-menu-button">
                {languageCode}
                <ArrowDropDown/>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose} data-vud-role="language-menu">
                {languages.map(language => <MenuItem key={language.code} onClick={(event) => this.handleSelect(language.code, event)}>{language.name} ({language.code})</MenuItem>)}
            </Menu>
        </React.Fragment>)
    }
}

LanguageMenu =(LanguageMenu);

export {LanguageMenu};
