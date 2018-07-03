let path = require('path');
const webpack = require('webpack');
let nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = {

        mode: "development",

        entry: {
            'siteSettingsSeo': './src/javascript/siteSettingsSeo-app.jsx'
        },

        output: {
            path: __dirname + '/src/main/resources/javascript/apps/',
            // publicPath: "/modules/site-settings-seo/javascript/apps/",
            filename: "[name].js",
            // chunkFilename: '[name].chunk.js',
        },

        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto",
                },

                {
                    test: /\.css$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                            }
                        },
                    ]
                },

                {
                    test: /\.jsx?$/,
                    include: [path.join(__dirname, "src")],
                    loader: 'babel-loader',

                    query: {
                        presets: [['env', {modules: false}],'react', 'stage-2'],
                        plugins: [
                            "lodash"
                        ]
                    }
                }
            ]
        },

        resolve: {
            mainFields: ['module','main'],
            extensions: ['.mjs', '.js', '.jsx', 'json']
        },

        plugins: [
            // new BundleAnalyzerPlugin({analyzerMode: "static"})
        ],

        devtool: 'source-map',
        watch: false

    }
;

module.exports = [config];
