'use strict';

const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development';

const webpackConfig = (config) => {
    const rootDir = config.rootDir;
    const outputDir = config.outputDir;
    const tsconfigPath = path.resolve(rootDir, "tsconfig.json");

    // const outputDir = path.resolve(rootDir, "dist");
    // const tsconfigPath = path.resolve(rootDir, "tsconfig.json");

    return {
        output: {
            filename: 'js/[name].bundle.js',
            path: outputDir,
            clean: true,
            publicPath: '/',
            libraryTarget: 'umd',
            library: '[name]',
            devtoolModuleFilenameTemplate: info =>
                'file:///' + path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
        },
        resolve: {
            extensions: ['.js', '.vue', '.ts', '.jsx', '.tsx'],
            // alias: {
            //     'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
            //     '@': rootdir
            // }
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(geojson|json)$/,
                    loader: 'json-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
                        { loader: 'css-loader', options: { sourceMap: isDev } },
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: [
                        isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
                        { loader: 'css-loader', options: { sourceMap: isDev } },
                        { loader: 'sass-loader', options: { sourceMap: isDev } }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.sass$/,
                    use: [
                        isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
                        { loader: 'css-loader', options: { sourceMap: isDev } },
                        { loader: 'sass-loader', options: { sourceMap: isDev } }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        configFile: tsconfigPath,
                    },
                },
                {
                    test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                    type: 'asset/inline',
                }
            ]
        }
    }
};

module.exports = webpackConfig;