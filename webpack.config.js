let config = {
        entry: {
            'seoSiteSettings': './src/javascript/seoSiteSettings-app.jsx'
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
        ],

        devtool: 'source-map',
        watch: false

    }
;

module.exports = [config];
