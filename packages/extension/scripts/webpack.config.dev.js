const path = require("path");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const FockTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const resolve = (_path) => path.resolve(__dirname, _path);

const isFirefox = process.env.RUN_ENV === "FIREFOX";
const isChrome = process.env.RUN_ENV === "CHROME";
const isEdge = process.env.RUN_ENV === "EDGE";
const isElectron = process.env.RUN_ENV === "ELECTRON";

const outputPath = {
  FIREFOX: resolve("../firefox/dist"),
  CHROME: resolve("../chrome/dist"),
  EDGE: resolve("../edge/dist"),
  ELECTRON: resolve("../electron/dist"),
}[process.env.RUN_ENV];

if (!outputPath) {
  throw new Error("unknown RUN_ENV");
}
const resolveOutputPath = (_path) => path.join(outputPath, _path);

/** @type import('webpack').WebpackOptionsNormalized */
const config = {
  mode: "development",
  devtool: "source-map",
  entry: {
    proxy: resolve("../src/modules/backend/proxy.ts"),
    dev: resolve("../src/modules/dev/index.ts"),
    panel: resolve("../src/modules/panel/index.tsx"),
    installHook: resolve("../src/modules/installHook/index.ts"),
    frontend: resolve("../src/modules/content/frontend.ts"),
    background: resolve("../src/modules/background/index.ts"),
  },
  output: {
    path: outputPath,
    filename: "[name]/index.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      src: resolve("../src"),
      dev: resolve("../src/modules/dev"),
      background: resolve("../src/modules/background"),
      content: resolve("../src/modules/content"),
      panel: resolve("../src/modules/panel"),
      images: resolve("../src/images"),
      utils: resolve("../src/utils"),
      types: resolve("../src/types"),
      components: resolve("../src/components"),
      "@styles": resolve("../src/styles"),
      react: resolve("../node_modules/react/index.js"),
    },
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
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
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
  plugins: [
    new FockTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve("../tsconfig.json"),
      },
    }),
    new HtmlWebpackPlugin({
      template: resolve("../src/modules/dev/index.html"),
      filename: resolveOutputPath("dev/index.html"),
      chunks: ["dev"],
    }),
    new HtmlWebpackPlugin({
      template: resolve("../src/modules/panel/index.html"),
      filename: resolveOutputPath("panel/index.html"),
      chunks: ["panel"],
    }),
    new DefinePlugin({
      __isDEV__: "true",
      __IS_FIREFOX__: JSON.stringify(isFirefox),
      __IS_CHROME__: JSON.stringify(isChrome),
      __IS_EDGE__: JSON.stringify(isEdge),
      __IS_ELECTRON__: JSON.stringify(isElectron),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: resolve("../src/images"),
          to: outputPath,
        },
      ],
    }),
  ],
  watch: true,
};

module.exports = config;
