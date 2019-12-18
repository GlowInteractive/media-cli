const HtmlWebpackPlugin = require("html-webpack-plugin");

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
            // Load all images as base64 encoding if they are smaller than 8192 bytes
            test: /\.(png|jpe?g|gif)$/,
            use: [
              {
                loader: "file-loader",
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
      plugins
    };
  }
};
