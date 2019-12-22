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
          "@shared": files.sharedDir,
          "@sharedStyles": files.sharedDir + "/styles",
          "@sharedScripts": files.sharedDir + "/scripts",
          "@sharedAssets": files.sharedAssetsDir,
          "shared-assets": files.sharedAssetsDir,
          "@templates": files.sharedDir + "/templates",
          "shared-templates": files.sharedDir + "/templates"
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
      plugins
    };
  }
};
