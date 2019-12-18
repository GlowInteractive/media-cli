const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  create(baseDir) {
    return {
      entry: `${baseDir}/scripts/index.js`,
      mode: "development",
      devtool: "eval-cheap-module-source-map",
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
            // Load all images as base64 encoding if they are smaller than 8192 bytes
            test: /\.(png|jpg|gif)$/,
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
          title: "Webpack Starter Kit",
          inject: true,
          template: `${baseDir}/index.html`
        })
        // new CopyPlugin([{ from: `shared/assets`, to: `assets` }])
      ]
    };
  }
};
