import React from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui';
import {MuiThemeProvider} from 'material-ui/styles/index';
import {muiTheme} from '@jahia/react-dxcomponents';
import {VanityUrlsTable} from "./VanityUrlsTable";

let SeoSiteSettings = function (props) {

    return (
        <MuiThemeProvider muiTheme={muiTheme()}>
            <div>
                <div className="page-header">
                    <h2>SEO</h2>
                </div>

                <div className="panel panel-default">
                    <VanityUrlsTable></VanityUrlsTable>
                </div>
            </div>
        </MuiThemeProvider>
    )
};

export {SeoSiteSettings};
