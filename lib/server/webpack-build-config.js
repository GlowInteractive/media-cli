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

  if (files.directoryExists(files.resolve(files.cwd, "shared", "assets"))) {
    plugins = [
      ...plugins,
      new CopyPlugin([
        {
          from: files.resolve(files.cwd, "shared", "assets"),
          to: buildPath + "/assets"
        }
      ])
    ];
  }

  return {
    entry: `${baseDir}/scripts/index.js`,
    mode: "production",
    stats: "minimal",
    devtool: false,
    output: {
      filename: "gmc-[name].js",
      path: buildPath
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
          // Load all images as base64 encoding if they are smaller than 8192 bytes
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "file-loader"
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Media Unit",
        inject: "body",
        template: `${baseDir}/index.html`
      }),
      ...plugins
    ]
  };
};
