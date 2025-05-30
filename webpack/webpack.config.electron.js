const path = require("path");
const { getModeConfig, movePreloads, getPreLoadsEntry } = require("./utils");
const { electronDirName, entryDir, prodMode } = require("./constant");
const { merge } = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (webpackConfigEnv, argv) => {
  const mode = argv.env?.mode || "development";
  const isProd = mode === prodMode;
  // 移动preloads文件夹到dist目录
  // movePreloads();
  return merge(
    {
      entry: {
        main: path.join(entryDir, electronDirName, "index.ts"),
        ...getPreLoadsEntry(),
      },
      mode,
      output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist"),
      },
      target: "electron-main",
      module: {
        rules: [
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: "asset/resource",
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
          },
          {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
        ],
        noParse: [/\.*native-require.js$/],
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx", ".less", ".json"],
      },
      externals: {
        'better-sqlite3': 'commonjs better-sqlite3',
      },
      plugins: [
        // new CopyPlugin({
        //   patterns: [
        //     {
        //       from: path.resolve(entryDir, electronDirName, 'sdk/JoyCastSDK'),
        //       to: path.resolve(__dirname, '../dist/JoyCastSDK'),
        //     },
        //     {
        //       from: path.resolve(
        //         entryDir,
        //         electronDirName,
        //         'sdk/mac-screen-capture-permissions/build'
        //       ),
        //       to: path.resolve(__dirname, '../dist/mac-screen-capture-permissions/build'),
        //     },
        //   ],
        // }),
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, "../node_modules/better-sqlite3"),
              to: path.resolve(__dirname, "../dist/node_modules/better-sqlite3"),
            },
            {
              from: path.resolve(__dirname, "../node_modules/bindings"),
              to: path.resolve(__dirname, "../dist/node_modules/bindings"),
            },
          ],
        }),
      ],
    },
    getModeConfig(isProd, "electron")
  );
};
