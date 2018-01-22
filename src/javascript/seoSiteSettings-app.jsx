import React from 'react';
import ReactDOM from 'react-dom';
import {SeoSiteSettings} from './components/SeoSiteSettings'

window.reactRender = function(target, id, dxContext) {
    ReactDOM.render(<SeoSiteSettings id={id} dxContext={dxContext}/>, document.getElementById(target));
};
