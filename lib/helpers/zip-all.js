const fs = require("fs");
const fse = require("fs-extra");
const archiver = require("archiver");
const files = require("./files");

module.exports = async function createArchives() {
  const unitsToZip = await files.getMediaUnitDirnames();

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
};
