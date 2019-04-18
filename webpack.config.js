let path = require('path');

let config = {

    mode: 'development',

    entry: {
        siteSettingsSeo: ['babel-polyfill', 'whatwg-fetch', './src/javascript/siteSettingsSeo-app.jsx']
    },

    output: {
        path: path.resolve(__dirname, 'src/main/resources/javascript/apps/'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            },

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            },

            {
                test: /\.jsx?$/,
                include: [path.join(__dirname, 'src')],
                loader: 'babel-loader',

                query: {
                    presets: [['env', {modules: false}], 'react', 'stage-2'],
                    plugins: [
                        'lodash'
                    ]
                }
            }
        ]
    },

    resolve: {
        mainFields: ['module', 'main'],
        extensions: ['.mjs', '.js', '.jsx', 'json']
    },

    plugins: [
    ],

    devtool: 'source-map',
    watch: false

};
module.exports = [config];
