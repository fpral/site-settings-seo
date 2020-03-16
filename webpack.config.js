const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Get manifest
var normalizedPath = require('path').join(__dirname, './target/dependency');
var manifest = '';
require('fs').readdirSync(normalizedPath).forEach(function (file) {
    manifest = './target/dependency/' + file;
    console.log('use manifest ' + manifest);
});

module.exports = (env, argv) => {
    let config = {
        entry: {
            main: ['whatwg-fetch', path.resolve(__dirname, 'src/javascript/publicPath'), path.resolve(__dirname, 'src/javascript/siteSettingsSeo-app')]
        },
        output: {
            path: path.resolve(__dirname, 'src/main/resources/javascript/apps/'),
            filename: 'site-settings-seo.bundle.js',
            chunkFilename: '[name].site-settings-seo.[chunkhash:6].js',
        },
        resolve: {
            mainFields: ['module', 'main'],
            extensions: ['.mjs', '.js', '.jsx', 'json']
        },
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto',
                },

                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            }
                        },
                    ]
                },
                {
                    test: /\.jsx?$/,
                    include: [path.join(__dirname, 'src')],
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ['@babel/preset-env', {modules: false, targets: {safari: '7', ie: '10'}}],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            'lodash'
                        ]
                    }
                }
            ]
        },
        plugins: [
            new webpack.DllReferencePlugin({
                manifest: require(manifest)
            }),
            new CleanWebpackPlugin(path.resolve(__dirname, 'src/main/resources/javascript/apps/'), {verbose: false}),
            new CopyWebpackPlugin([{from: path.resolve(__dirname, 'src/javascript/register.js'), to: path.resolve(__dirname, 'src/main/resources/javascript/apps/')}])
        ],
        watch: false,
        mode: 'development'
    };

    config.devtool = (argv.mode === 'production') ? 'source-map' : 'eval-source-map';

    if (argv.analyze) {
        config.devtool = 'source-map';
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
};
