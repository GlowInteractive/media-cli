const HtmlWebpackPlugin = require("html-webpack-plugin");
const files = require("../helpers/files");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  create(baseDir) {
    let plugins = [
      new HtmlWebpackPlugin({
        title: "Webpack Starter Kit",
        inject: true,
        template: `${baseDir}/index.html`
      }),
      new CopyPlugin([
        {
          from: files.sharedAssetsDir,
          to: "shared-assets"
        }
      ])
    ];

    return {
      entry: `${baseDir}/scripts/index.js`,
      mode: "development",
      devtool: "eval-cheap-module-source-map",
      resolve: {
        alias: {
          "@sharedAssets": files.sharedAssetsDir,
          "shared-assets": files.sharedAssetsDir,
          "@templates": files.sharedDir + "/templates",
          "shared-templates": files.sharedDir + "/templates",
          assets: "./assets"
        }
      },
      output: {
        filename: "bundle.js"
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          },
          {
            test: /\.(scss|css)$/,
            use: ["style-loader", "css-loader", "sass-loader"]
          },
          {
            test: /\.svg$/,
            loader: "svg-inline-loader"
          },
          // can probably remove this if we won't be requiring assets in JS
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
      plugins
    };
  }
};
