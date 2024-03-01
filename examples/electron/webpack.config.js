const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FockTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const resolve = (_path) => path.resolve(__dirname, _path);

/** @type import('webpack').WebpackOptionsNormalized */
const config = {
  watch: true,
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "source-map",
  output: {
    filename: "index.js",
    path: resolve("dist"),
    libraryTarget: "umd",
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
      {
        test: /\.less$/,
        oneOf: [
          {
            test: /\.module\./,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: "[local]_[hash:base64:5]",
                  },
                },
              },
              "less-loader",
            ],
          },
          {
            use: ["style-loader", "css-loader", "less-loader"],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      components: resolve("../components"),
      react: resolve("./node_modules/react/index.js"),
      mobx: resolve("./node_modules/mobx/dist/index.js"),
    },
  },
  plugins: [
    new FockTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve("./tsconfig.json"),
      },
    }),
    new HtmlWebpackPlugin({
      template: resolve("./src/index.html"),
      filename: resolve("./dist/index.html"),
    }),
  ],
};

module.exports = config;
