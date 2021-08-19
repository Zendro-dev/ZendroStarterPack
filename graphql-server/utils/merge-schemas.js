
var { fileLoader, mergeTypes } = require('merge-graphql-schemas');


/**
 * @function - Merge graphql schemas stored in a same directory
 *
 * @param  {string} schemas_folder path to directory where all graphql schemas are stored.
 * @return {string}                Merged graphql schema.
 */
module.exports = function( schemas_folder ) {
  const typesArray = fileLoader( schemas_folder);
  let merged = mergeTypes(typesArray);
  return merged;
}
