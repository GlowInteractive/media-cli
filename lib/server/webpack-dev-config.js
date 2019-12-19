const HtmlWebpackPlugin = require("html-webpack-plugin");
const files = require("../helpers/files");

module.exports = {
  create(baseDir) {
    let plugins = [
      new HtmlWebpackPlugin({
        title: "Webpack Starter Kit",
        inject: true,
        template: `${baseDir}/index.html`
      })
    ];

    return {
      entry: `${baseDir}/scripts/index.js`,
      mode: "development",
      devtool: "eval-cheap-module-source-map",
      resolve: {
        alias: {
          "@sharedAssets": files.sharedAssetsDir,
          "@templates": files.sharedDir + "/templates"
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
