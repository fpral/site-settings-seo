import React from 'react';

import {pure} from 'recompose';
import {SvgIcon} from 'material-ui';

let PageIcon = props => (
    <SvgIcon {...props} viewBox={'0 0 512 512'}>
        <path d="M94.94,71.93V440.07H417.06V71.93Zm45.7,45.58H256v92.35H140.64Zm127,276.9h-127V371.28h127Zm103.76-46.13H140.64V325.15H371.36Zm0-46.14H140.64V279H371.36Zm0-46.14H140.64V232.87H371.36Z"/>
    </SvgIcon>
);

PageIcon.displayName = "PageIcon";
PageIcon = pure(PageIcon);
PageIcon.muiName = 'SvgIcon';

export default PageIcon;