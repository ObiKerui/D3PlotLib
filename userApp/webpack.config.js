'use strict';

const HtmlPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = () => {
    const rootDir = path.resolve(__dirname, '..');

    const projectConfig = {
        context: rootDir,
        entry: {
            propertyCalculator: './propertyCalculator/main.ts',
            d3Visualisations: './d3Visualisations/main.ts',            
            appmodule: './userApp/main.ts'
        },
        plugins: [
            new HtmlPlugin({
                hash: true,
                filename: 'index.html',
                template: path.resolve(rootDir, 'userApp/index.html'),
                inject: 'body'
            })
        ],
        output: {
            filename: 'js/[name].bundle.js'
        }
    }

    const paths = {
        rootDir: rootDir,
        outputDir: path.resolve(rootDir, "dist")
    };

    const commonBlock = require('../buildtools/webpack.config')(paths);
    return merge(commonBlock, projectConfig);
};