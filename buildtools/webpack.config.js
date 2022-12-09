'use strict';
const { merge } = require('webpack-merge');
const path = require('path');
const environment = (process.env.NODE_ENV || 'development').trim();

module.exports = (config) => {

    if(!config) {
        console.log('no config supplied');
        config = {
            rootDir: path.resolve(__dirname, '.'),
            outputDir: path.resolve(__dirname, 'dist'),
        };
    }

    const commonBlock = require('./webpack.config.common')(config);

    if (environment === 'development') {
        const devConfig = require('./webpack.config.dev')(config);
        return merge(commonBlock, devConfig);
    } else {
        const prodConfig = require('./webpack.config.prod')(config);
        return merge(commonBlock, prodConfig);
    }
}