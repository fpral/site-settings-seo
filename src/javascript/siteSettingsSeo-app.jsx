import React from 'react';
import ReactDOM from 'react-dom';
import {SiteSettingsSeo} from './SiteSettingsSeo/SiteSettingsSeo';

window.reactRender = function (target, id, dxContext) {
    ReactDOM.render(<SiteSettingsSeo id={id} dxContext={dxContext}/>, document.getElementById(target));
};
