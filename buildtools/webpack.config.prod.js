'use strict';

const webpack = require('webpack');
const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const isProd = process.env.NODE_ENV === 'production';
const environment = {
    NODE_ENV: 'production'
};

const webpackConfig = (config) => {
    return {
        mode: 'production',
        // output: {
        // chunkFilename: 'js/[id].[hash].chunk.js'
        // },
        // optimization: {
        //     runtimeChunk: 'single',
        //     minimizer: [
        //         new OptimizeCSSAssetsPlugin({
        //             cssProcessorPluginOptions: {
        //                 preset: ['default', { discardComments: { removeAll: true } }],
        //             }
        //         }),
        //         new UglifyJSPlugin({
        //             cache: true,
        //             parallel: true,
        //             sourceMap: !isProd
        //         })
        //     ],
        //     splitChunks: {
        //         chunks: 'all',
        //         maxInitialRequests: Infinity,
        //         minSize: 0,
        //         cacheGroups: {
        //             vendor: {
        //                 test: /[\\/]node_modules[\\/]/,
        //                 name(module) {
        //                     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
        //                     return `npm.${packageName.replace('@', '')}`;
        //                 }
        //             },
        //             styles: {
        //                 test: /\.css$/,
        //                 name: 'styles',
        //                 chunks: 'all',
        //                 enforce: true
        //             }
        //         }
        //     }
        // },
        plugins: [
            new webpack.EnvironmentPlugin(environment),
            new MiniCSSExtractPlugin({
                filename: 'css/[name].css'
            }),

            // new MiniCSSExtractPlugin({
            //     filename: 'css/[name].[hash].css',
            //     chunkFilename: 'css/[id].[hash].css'
            // }),
            // new CompressionPlugin({
            //     filename: '[path].gz[query]',
            //     algorithm: 'gzip',
            //     test: new RegExp('\\.(js|css)$'),
            //     threshold: 10240,
            //     minRatio: 0.8
            // }),
            // new webpack.HashedModuleIdsPlugin()
        ]
    }
};

// if (!isProd) {
//     webpackConfig.devtool = 'source-map';

//     if (process.env.npm_config_report) {
//         const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//         webpackConfig.plugins.push(new BundleAnalyzerPlugin());
//     }
// }

module.exports = webpackConfig;