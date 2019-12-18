const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const WebpackDevConfig = require("./webpack-dev-config");
const WebpackBuildConfig = require("./webpack-build-config");
const files = require("../helpers/files");

module.exports = {
  serve: function(dirToServe) {
    const serveDir = files.getMediaUnitPath(dirToServe);
    const webpackConfig = WebpackDevConfig.create(serveDir);
    const compiler = Webpack(webpackConfig);

    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
      open: false,
      contentBase: serveDir,
      stats: {
        colors: true,
        all: false,
        modules: false,
        assets: false
      }
    });

    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(8080, "127.0.0.1", () => {
      console.log("Starting server on http://localhost:8080");
    });
  },
  async build(dir) {
    return Webpack(WebpackBuildConfig(dir), (err, stats) => {
      const info = stats.toJson();
      if (stats.hasErrors()) {
        console.error(info.errors);
      }
    });
  }
};
