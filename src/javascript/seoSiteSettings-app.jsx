import React from 'react';
import ReactDOM from 'react-dom';
import {SeoSiteSettings} from './components/SeoSiteSettings'

window.reactRender = function(target) {
    ReactDOM.render(<SeoSiteSettings/>, document.getElementById(target));
};
