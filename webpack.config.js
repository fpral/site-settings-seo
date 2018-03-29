let path = require('path');

let config = {
        entry: {
            'siteSettingsSeo': './src/javascript/siteSettingsSeo-app.jsx'
        },

        output: {
            path: __dirname + '/src/main/resources/javascript/apps/',
            filename: "[name].js",
        },

        module: {
            rules: [
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
                    include: [path.join(__dirname,"src")],
                    loader: 'babel-loader',

                    query: {
                        presets: ['env', 'react', 'stage-2']
                    }
                }
            ]
        },

        resolve: {
            extensions: ['.js', '.jsx']
        },

        plugins: [
        ],

        devtool: 'source-map',
        watch: false

    }
;

module.exports = [config];
