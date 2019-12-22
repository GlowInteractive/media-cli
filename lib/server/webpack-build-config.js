const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const files = require("../helpers/files");
const webpack = require("webpack");

module.exports = dirName => {
  const baseDir = files.getMediaUnitPath(dirName);
  const buildPath = `${baseDir}/dist`;

  let plugins = [
    new webpack.BannerPlugin({
      banner: `
███╗   ███╗ █████╗ ██████╗ ███████╗    ██████╗ ██╗   ██╗     ██████╗ ██╗      ██████╗ ██╗    ██╗
████╗ ████║██╔══██╗██╔══██╗██╔════╝    ██╔══██╗╚██╗ ██╔╝    ██╔════╝ ██║     ██╔═══██╗██║    ██║
██╔████╔██║███████║██║  ██║█████╗      ██████╔╝ ╚████╔╝     ██║  ███╗██║     ██║   ██║██║ █╗ ██║
██║╚██╔╝██║██╔══██║██║  ██║██╔══╝      ██╔══██╗  ╚██╔╝      ██║   ██║██║     ██║   ██║██║███╗██║
██║ ╚═╝ ██║██║  ██║██████╔╝███████╗    ██████╔╝   ██║       ╚██████╔╝███████╗╚██████╔╝╚███╔███╔╝
╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝    ╚═════╝    ╚═╝        ╚═════╝ ╚══════╝ ╚═════╝  ╚══╝╚══╝ 
`
    }),
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
        from: path.resolve(baseDir, "assets/"),
        to: buildPath + "/assets"
      }
    ]),
    new CopyPlugin([
      {
        from: files.sharedAssetsDir,
        to: buildPath + "/shared-assets"
      }
    ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      jpegtran: null,
      plugins: [
        imageminMozjpeg({
          quality: 60,
          progressive: true
        })
      ]
    })
  ];

  return {
    entry: `${baseDir}/scripts/index.js`,
    mode: "production",
    stats: "minimal",
    devtool: false,
    output: {
      filename: "glow-[name].js",
      path: buildPath
    },
    resolve: {
      alias: {
        "@shared": files.sharedDir,
        "@sharedStyles": files.sharedDir + "/styles",
        "@sharedScripts": files.sharedDir + "/scripts",
        "@sharedAssets": files.sharedAssetsDir,
        "shared-assets": files.sharedAssetsDir,
        "@templates": files.sharedDir + "/templates",
        "shared-templates": files.sharedDir + "/templates"
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
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                attrs: false,
                interpolate: true
              }
            },
            files.resolve(__dirname, "interpolation-loader.js")
          ]
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
