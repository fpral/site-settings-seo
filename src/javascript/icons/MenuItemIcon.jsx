import React from 'react';

import {pure} from 'recompose';
import {SvgIcon} from 'material-ui';

let MenuItemIcon = props => (
    <SvgIcon {...props} viewBox={'0 0 512 512'}>
        <path d="M105,0V368.14H427.11V0Zm45.7,45.58H266.05v92.35H150.69Zm127,276.9h-127V299.35h127Zm103.77-46.13H150.69V253.22H381.42Zm0-46.14H150.69V207.08H381.42Zm0-46.14H150.69V160.94H381.42Z"/><polygon points="84.94 52.69 52.3 52.69 52.3 420.83 374.42 420.83 374.42 388.19 84.94 388.19 84.94 52.69"/><polygon points="32.64 104.99 0 104.99 0 473.13 322.12 473.13 322.12 440.49 32.64 440.49 32.64 104.99"/>
    </SvgIcon>
);

MenuItemIcon.displayName = "MenuItemIcon";
MenuItemIcon = pure(MenuItemIcon);
MenuItemIcon.muiName = 'SvgIcon';

export default MenuItemIcon;
