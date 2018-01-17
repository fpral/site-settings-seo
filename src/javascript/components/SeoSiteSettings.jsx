import React from 'react';
import {TableHeader, TableHeaderColumn, TableRowColumn} from 'material-ui';
import {store, theme} from '@jahia/react-dxcomponents';
import {client} from '@jahia/apollo-dx';
import {VanityUrlsTable} from "./VanityUrlsTable";
import {ApolloProvider} from 'react-apollo';
import {Provider} from 'react-redux'

let SeoSiteSettings = function (props) {

    return (
        <Provider store={store}>
            <ApolloProvider client={client}>
                <div>
                    <div className="page-header">
                        <h2>SEO</h2>
                    </div>

                    <div className="panel panel-default">
                        <VanityUrlsTable></VanityUrlsTable>
                    </div>
                </div>
            </ApolloProvider>
        </Provider>
    )
};

export {SeoSiteSettings};
