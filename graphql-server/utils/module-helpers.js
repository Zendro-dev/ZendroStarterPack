const { readdirSync } = require('fs');
const { parse }       = require('path');


/**
 * Get all valid JavaScript modules from a specified directory.
 * @param {string} dirPath full path to the modules folder
 */
module.exports.getModulesSync = dirPath =>
  readdirSync(dirPath).filter(this.isModule);

/**
 * Check whether a file is a export candidate for a module folder. Valid
 * candidates are JavaScript (.js) files that are not "index.js" or start
 * with a dot (".name.js").
 * @param {string} file name of the file to be checked
 * @returns boolean
 */
module.exports.isModule = file => {

  const fileObj = parse(file);

  const isDotFile = fileObj.name.indexOf('.') === 0;
  const isModuleIndex = fileObj.base === 'index.js';
  const isJsFile = fileObj.ext === '.js';

  return ( !isDotFile && !isModuleIndex && isJsFile );
}
