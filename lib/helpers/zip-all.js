const fs = require("fs");
const fse = require("fs-extra");
const archiver = require("archiver");
const files = require("./files");

// get the directory names of all media-units in the media-units DIR
// we'll use the directory names for accessing the files inside each unit
// and for creating the zip

function getMediaUnitDirNames() {
  return new Promise((res, rej) => {
    fs.readdir(files.mediaUnitsDir, function(err, files) {
      if (err) {
        rej(err);
      }
      res(files);
    });
  });
}

module.exports = async function createArchives() {
  const unitsToZip = await getMediaUnitDirNames();
  fse.emptyDirSync(files.archivesPath);

  unitsToZip.forEach(unit => {
    var output = fs.createWriteStream(`${files.archivesPath}/${unit}.zip`);
    var archive = archiver("zip", { zlib: { level: 9 } });
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
