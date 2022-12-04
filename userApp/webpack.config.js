'use strict';

const HtmlPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path');

module.exports = () => {
    const rootDir = path.resolve(__dirname, '..');

    const projectConfig = {
        context: rootDir,
        entry: {
            d3PlotLib: './d3PlotLib/main.ts',            
            appmodule: './userApp/main.tsx'
        },
        plugins: [
            new HtmlPlugin({
                hash: true,
                filename: 'index.html',
                template: path.resolve(rootDir, 'userApp/index.html'),
                inject: 'body'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: "userApp/assets", to: "assets" },
                ],
            }),
            new ESLintPlugin()
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