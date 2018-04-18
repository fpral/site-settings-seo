import React from 'react';
import * as _ from 'lodash';
import {translate} from 'react-i18next';
import {Checkbox, FormControl, FormControlLabel, Input, ListItem, ListItemText, MenuItem, Select, withStyles} from 'material-ui';

const maxSelectedLanguageNamesDisplayed = 2;

class LanguageSelector extends React.Component {

    constructor(props) {

        super(props);
        this.languageByCode = _.keyBy(this.props.languages, 'code');
        this.emptySelectionAllowed = (this.props.emptySelectionAllowed == null ? true : this.props.emptySelectionAllowed);

        this.onAllLanguagesChange = this.onAllLanguagesChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getSelectedLanguagesValue = this.getSelectedLanguagesValue.bind(this);
        this.getSelectedLanguageCodes = this.getSelectedLanguageCodes.bind(this);
    }

    onAllLanguagesChange(event, checked) {
        if (checked) {
            // The All Languages checkbox has been checked: select all languages.
            let selectedLanguageCodes = this.props.languages.map(language => language.code);
            this.props.onSelectionChange(selectedLanguageCodes);
        } else if (this.props.selectedLanguageCodes.length == this.props.languages.length) {
            // The All Languages checkbox has been unchecked while all languages were checked: deselect all languages.
            this.props.onSelectionChange([]);
        }
    }

    onChange(event) {
        let selectedLanguageCodes = this.getSelectedLanguageCodes(event.target.value);
        this.props.onSelectionChange(selectedLanguageCodes);
    }

    getSelectedLanguagesValue(selected) {

        let selectedLanguageCodes = _.sortBy(this.getSelectedLanguageCodes(selected));

        if (selectedLanguageCodes.length == this.props.languages.length) {
            // All languages selected.
            return this.props.t('label.languageSelector.allLanguages');
        } else {

            let selectedLanguageNames = selectedLanguageCodes.map(selectedLanguageCode => this.languageByCode[selectedLanguageCode].name);
            if (selectedLanguageNames.length > maxSelectedLanguageNamesDisplayed) {
                // (Too) many languages selected: will display a part of them, plus "N more languages".
                selectedLanguageNames = selectedLanguageNames.slice(0, maxSelectedLanguageNamesDisplayed - 1);
                selectedLanguageNames[selectedLanguageNames.length] = this.props.t('label.languageSelector.moreLanguages', {count: (selectedLanguageCodes.length - selectedLanguageNames.length)});
            }

            let languages = selectedLanguageNames[0];
            for (var i = 1; i < selectedLanguageNames.length; i++) {
                let languageName = selectedLanguageNames[i];
                if (i < selectedLanguageNames.length - 1) {
                    languages = this.props.t('label.languageSelector.partialLanguages', {
                        names: languages,
                        nextName: languageName
                    });
                } else {
                    languages = this.props.t('label.languageSelector.languages', {
                        names: languages,
                        lastName: languageName
                    });
                }
            }
            return languages;
        }
    }

    getSelectedLanguageCodes(selected) {
        // Filter out the All Languages fake (null) language code when handling menu events.
        return _.filter(selected, (selected => selected != null));
    }

    render() {

        let selectedLanguageCodes = this.props.selectedLanguageCodes;
        let allLanguagesChecked = (selectedLanguageCodes.length == this.props.languages.length);

        return (

            <Select
                multiple
                value={selectedLanguageCodes}
                renderValue={this.getSelectedLanguagesValue}
                className={this.props.className}
                classes={this.props.classes}
                style={this.props.style}
                onChange={this.onChange}
            >

                {
                    // Render the All Languages checkbox as a menu item so that it is displayed uniformly with individual language items.
                    // However, supply null value to it and ignore it when handling menu change events afterwards; instead handle the checkbox's change event directly.
                }
                <MenuItem value={null} disabled={!this.emptySelectionAllowed && allLanguagesChecked /*Do not allow unchecking all in case empty selection is not allowed.*/}>
                    <Checkbox
                        checked={allLanguagesChecked}
                        indeterminate={(selectedLanguageCodes.length > 0) && (selectedLanguageCodes.length < this.props.languages.length)}
                        onChange={this.onAllLanguagesChange}
                    />
                    <ListItemText primary={this.props.t('label.languageSelector.allLanguages')}/>
                </MenuItem>

                {this.props.languages.map(language => {

                    let checked = (selectedLanguageCodes.indexOf(language.code) >= 0);

                    // Do not allow unchecking the only selected item in case empty selection is not allowed.
                    let disabled = (!this.emptySelectionAllowed && checked && selectedLanguageCodes.length == 1);

                    return (
                        <MenuItem key={language.code} value={language.code} disabled={disabled}>
                            <Checkbox checked={checked}/>
                            <ListItemText primary={language.name + ' (' + language.code + ')'}/>
                        </MenuItem>
                    )
                })}
            </Select>
        )
    }
}

LanguageSelector = translate('site-settings-seo')(LanguageSelector);

export {LanguageSelector};
