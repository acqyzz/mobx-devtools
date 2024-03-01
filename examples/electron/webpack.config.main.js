const path = require("path");
const FockTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const resolve = (_path) => path.resolve(__dirname, _path);

/** @type import('webpack').WebpackOptionsNormalized */
const config = {
  watch: true,
  mode: "development",
  entry: "./main.js",
  devtool: "source-map",
  output: {
    filename: "[name]/index.js",
    path: resolve("dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts)|(tsx)/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 2,
              workerNodeArgs: ["--max-old-space-size=1536"],
              poolTimeout: 2000,
            },
          },
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new FockTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve("./tsconfig.json"),
      },
    }),
  ],
};

module.exports = config;
