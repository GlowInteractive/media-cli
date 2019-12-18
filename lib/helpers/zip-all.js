const fs = require("fs");
const fse = require("fs-extra");
const archiver = require("archiver");
const files = require("./files");
const logger = require("./logger");
const { creatingArchives, archivesDone } = require("./messages");

module.exports = async function createArchives() {
  logger.log(creatingArchives);
  const unitsToZip = await files.mediaUnitDirnames;
  fse.emptyDirSync(files.archivesPath);

  unitsToZip.forEach(unit => {
    const output = fs.createWriteStream(`${files.archivesPath}/${unit}.zip`);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", err => {
      throw {
        err,
        type: "zip",
        msg: "Something bad happened while archiving."
      };
    });
    archive.pipe(output);
    archive.directory(`${files.mediaUnitsDir}/${unit}/dist/`, false);
    archive.finalize();
  });

  logger.logWithBg(archivesDone);
};
