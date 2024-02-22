const path = require("path");
const FockTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

/** @type import('webpack').WebpackOptionsNormalized */
const config = {
  entry: "./src/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
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
  plugins: [new FockTsCheckerWebpackPlugin()],
};

module.exports = config;
