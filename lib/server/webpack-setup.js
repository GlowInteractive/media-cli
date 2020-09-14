const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const WebpackDevConfig = require("./webpack-dev-config");
const WebpackBuildConfig = require("./webpack-build-config");
const files = require("../helpers/files");

const statsOptions = {
  colors: true,
  all: false,
  modules: false,
  assets: true,
  errors: true
};

function buildUnit(dir) {
  return new Promise((res, rej) => {
    Webpack(WebpackBuildConfig(dir), (err, stats) => {
      if (err) {
        rej(err);
      } else {
        const info = stats.toJson(statsOptions);
        if (stats.hasErrors()) {
          rej(info.errors);
        } else {
          res(info);
        }
      }
    });
  });
}

module.exports = {
  serve: function(dirToServe) {
    const serveDir = files.getMediaUnitPath(dirToServe);
    const webpackConfig = WebpackDevConfig.create(serveDir);
    const compiler = Webpack(webpackConfig);

    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
      open: false,
      contentBase: serveDir,
      stats: statsOptions,
      publicPath: "/"
    });

    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(8080, "127.0.0.1", () => {
      console.log("Starting server on http://localhost:8080");
    });
  },
  async build(dir) {
    return buildUnit(dir);
  },
  async buildAll() {
    const mediaUnitNames = await files.mediaUnitDirnames;
    await Promise.all(mediaUnitNames.map(unitPath => buildUnit(unitPath)));
  }
};