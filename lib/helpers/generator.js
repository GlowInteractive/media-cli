const defaultSizes = ["160x600", "300x250", "300x600", "728x90"];

module.exports = {
  defaultSizes,
  createUnitsToGenerate: function (copyMap, sizes = defaultSizes) {
    const lmrKeys = Object.keys(copyMap);
    const unitsByLMR = lmrKeys.map(lmr => {
      const batchData = copyMap[lmr];

      return sizes.map(size => ({
        ...batchData,
        size,
        templateName: batchData.templatePrefix + "-" + size,
        lmr,
        namePrefix: batchData.templatePrefix + "-" + batchData.namePrefix
      }));
    });

    return unitsByLMR.reduce((pv, cv, i) => {
      return pv.concat(cv);
    }, []);
  }
};
