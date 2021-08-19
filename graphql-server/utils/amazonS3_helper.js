const searchArg = require("./search-argument");
/**
 *
 * @param {object} search zendro search
 * @param {object} definition definition as specified in the model
 * @param {string} arrayDelimiter delimiter for array
 *
 * @returns {string} WHERE ... string
 */
module.exports.searchConditionsToAmazonS3 = function (
  search,
  definition,
  arrayDelimiter
) {
  let whereOptions = "";
  if (search !== undefined && search !== null) {
    if (typeof search !== "object") {
      throw new Error('Illegal "search" argument type, it must be an object.');
    }
    let arg = new searchArg(search);
    whereOptions =
      " WHERE " + arg.toAmazonS3(definition.attributes, arrayDelimiter);
  }
  return whereOptions;
};

/**
 * @param {object} search zendro search
 * @param {object} pagination pagination argument given to the query
 * @param {String} idAttribute idAttribute of the model calling this funtion
 */
module.exports.cursorPaginationArgumentsToAmazonS3 = function (
  search,
  pagination,
  idAttribute
) {
  let offsetCursor = pagination ? pagination.after : null;
  let operator = pagination.includeCursor ? "gte" : "gt";
  let amazonS3Search = Object.assign({}, search);
  if (offsetCursor) {
    let decoded_cursor = JSON.parse(
      Buffer.from(offsetCursor, "base64").toString("utf-8")
    );
    let cursorId = decoded_cursor[idAttribute];
    let cursorSearchCondition = {
      field: idAttribute,
      value: cursorId,
      operator: operator,
      search: undefined,
    };
    if (search) {
      // -- Use *both* the given search condition and the cursor --
      amazonS3Search = {
        operator: "and",
        search: [search, cursorSearchCondition],
      };
    } else {
      // -- Use only the cursor --
      amazonS3Search = cursorSearchCondition;
    }
  }
  return amazonS3Search;
};
