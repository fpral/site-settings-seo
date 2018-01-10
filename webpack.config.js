let SystemJSPlugin = require('webpack-systemjs-bundle-plugin/');
let webpack = require('webpack');
let nodeExternals = require('webpack-node-externals');

let config = {
        entry: {
            'seo-settings': ['.']
        },

        externals: [
            nodeExternals({importType: 'amd', whitelist:["material-ui-pagination"]})
        ],

        output: {
            path: __dirname + '/src/main/resources/javascript/bundles/',
            filename: "[name].js",
            libraryTarget: "amd",
            library: "[name]_[hash]"
        },

        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',

                    query: {
                        presets: ['es2015', 'react', 'stage-2']
                    }
                }
            ]
        },

        resolve: {
            extensions: ['.js', '.jsx']
        },

        plugins: [
            new SystemJSPlugin({
                path: __dirname + "/src/main/resources/javascript/bundles/[name].config.json",
                name: "[name]_[hash]"
            }),
        ],

        devtool: 'source-map'

    }
;

module.exports = [config];
