const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const files = require("../helpers/files");

module.exports = dirName => {
  const baseDir = files.getMediaUnitPath(dirName);
  const buildPath = `${baseDir}/dist`;

  let plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css"
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require("cssnano"),
      cssProcessorOptions: {
        map: false,
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true
    }),
    new CopyPlugin([
      {
        from: path.resolve(baseDir, "assets"),
        to: buildPath + "/assets"
      }
    ])
  ];

  return {
    entry: `${baseDir}/scripts/index.js`,
    mode: "production",
    stats: "minimal",
    devtool: false,
    output: {
      filename: "gmc-[name].js",
      path: buildPath
    },
    resolve: {
      alias: {
        "@sharedAssets": files.sharedAssetsDir,
        "@templates": files.sharedDir + "/templates"
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader"
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: "file-loader",
          options: {
            name(file) {
              if (file.includes("/shared/assets")) {
                return "sharedAssets/[name].[ext]";
              } else {
                return "[path][name].[ext]";
              }
            },
            limit: 8192
          }
        },
        {
          test: /\.html$/,
          loaders: ["html-loader"],
          exclude: /(index.html)/
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: "body",
        template: `${baseDir}/index.html`
      }),
      ...plugins
    ]
  };
};
