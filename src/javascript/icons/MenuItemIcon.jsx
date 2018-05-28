import React from 'react';

import {pure} from 'recompose';
import {SvgIcon} from 'material-ui';

let MenuItemIcon = props => (
    <SvgIcon {...props} viewBox={'0 0 512 512'}>
        <path d="M251.07,242.39,219,210.31H90.38V466.93H421.62V242.39Z"/><path d="M137.14,58.62V352H393.85V58.62ZM173.56,95h91.93v73.6H173.56ZM274.74,315.63H173.56V297.19H274.74Zm82.69-36.77H173.56V260.43H357.43Zm0-36.77H173.56V223.66H357.43Zm0-36.77H173.56V186.89H357.43Z"/>
    </SvgIcon>
);

MenuItemIcon.displayName = "MenuItemIcon";
MenuItemIcon = pure(MenuItemIcon);
MenuItemIcon.muiName = 'SvgIcon';

export default MenuItemIcon;