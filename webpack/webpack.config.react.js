const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getEntryList, getModeConfig } = require('./utils');
const { electronDirName, commonDirName, entryDir, prodMode } = require('./constant');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (webpackConfigEnv, argv) => {
  const mode = argv.env?.mode || 'development';
  const isProd = mode === prodMode;
  const entry = getEntryList(entryDir);
  delete entry[electronDirName];
  delete entry[commonDirName];

  const htmlPlugins = Object.keys(entry).map((entryName) => {
    return new HtmlWebpackPlugin({
      template: path.join(entry[entryName], './index.html'),
      filename: entryName + '.html',
      chunks: [entryName],
    });
  });

  return {
    entry,
    mode,
    ...getModeConfig(isProd),
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist'),
    },
    target: 'electron-renderer',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                },
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: '[path]--[hash:base64:5]',
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
      noParse: /\.*native-require.js$/,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.json'],
    },
    plugins: [
      ...htmlPlugins,
    ],
  };
};
