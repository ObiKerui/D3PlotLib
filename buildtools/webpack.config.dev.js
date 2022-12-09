'use strict';

const path = require('path');
const webpack = require('webpack');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const environment = {
    NODE_ENV: 'development'
};

const webpackConfig = (config) => {

    const rootDir = config.rootDir;

    return {
        mode: 'development',
        devtool: 'eval-cheap-module-source-map',
        // optimization: {
        //     runtimeChunk: 'single',
        //     splitChunks: {
        //         chunks: 'all'
        //     }
        // },
        plugins: [
            new webpack.EnvironmentPlugin(environment),
            // new webpack.HotModuleReplacementPlugin(),
            new Serve({
                port: 3000,
                // hmr: true,
                static: [`${rootDir}/dist`]
            })
        ],
        watch: true,
    }
};

module.exports = webpackConfig;
