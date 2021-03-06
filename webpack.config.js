const webpack = require('webpack');
const AwsSamPlugin = require('aws-sam-webpack-plugin');

const awsSamPlugin = new AwsSamPlugin();

module.exports = {
    // Loads the entry object from the AWS::Serverless::Function resources in your
    // template.yaml or template.yml
    entry: awsSamPlugin.entry(),

    // Write the output to the .aws-sam/build folder
    output: {
        filename: '[name]/index.js',
        libraryTarget: 'commonjs2',
        path: __dirname + '/.aws-sam/build/',
    },

    // Create source maps
    devtool: 'source-map',

    // Resolve .ts and .js extensions
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },

    // Target node
    target: 'node',

    // Includes the aws-sdk only for development. The node10.x docker image
    // used by SAM CLI Local doens't include it but it's included in the actual
    // Lambda runtime.
    //externals: process.env.NODE_ENV === "development" ? [] : ["aws-sdk"],

    // Set the webpack mode
    mode: 'development',

    // Add the TypeScript loader
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
    },

    // to work around a sequelize bug: https://github.com/sequelize/sequelize/issues/7509
    externals: ['sqlite3', 'tedious', 'mysql2', 'mariadb'],

    // Add the AWS SAM Webpack plugin
    plugins: [awsSamPlugin, new webpack.IgnorePlugin(/^pg-native$/)],
};
