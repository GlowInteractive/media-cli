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
        // ignore: "*.svg"
      }
    ])
  ];

  if (files.directoryExists(files.resolve(files.cwd, "shared", "assets"))) {
    console.log(
      "copy assets",
      files.resolve(files.cwd, "shared", "assets"),
      buildPath
    );

    plugins = [
      ...plugins,
      new CopyPlugin([
        {
          from: files.resolve(files.cwd, "shared", "assets"),
          to: buildPath + "/assets"
          // ignore: "*.svg"
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
          // Load all images as base64 encoding if they are smaller than 8192 bytes
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                // On development we want to see where the file is coming from, hence we preserve the [path]
                name: "[path][name].[ext]?hash=[hash:20]",
                limit: 8192
              }
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
        // svgoConfig: {
        //   removeDimensions: false
        // }
      }),
      ...plugins
    ]
  };
};
