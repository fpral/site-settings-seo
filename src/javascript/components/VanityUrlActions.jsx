import React from 'react';
import {Button, withStyles} from 'material-ui';
import {translate} from 'react-i18next';

let styles = theme => ({
    moveButton: {
        color:"blue"
    },
    publishButton: {
        color:"orange"
    },
    deleteButton: {
        color:"red"
    }
});

class VanityUrlActions extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { classes, t, selection } = this.props;
        return <div>
            <Button size="small" classes={{root:classes.moveButton}}>{t('label.actions.move')}</Button>
            <Button size="small" classes={{root:classes.publishButton}}>{t('label.actions.publish')}</Button>
            <Button size="small" classes={{root:classes.deleteButton}}>{t('label.actions.delete')}</Button>
        </div>
    }
}

VanityUrlActions = withStyles(styles)(translate('site-settings-seo')(VanityUrlActions));

export { VanityUrlActions }