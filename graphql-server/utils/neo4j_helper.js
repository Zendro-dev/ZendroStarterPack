const searchArg = require("./search-argument");

/**
 * processDateTime - process DateTime string into ISO string
 * @param {object} input input
 * @param {object} attributes attributes as specified in the model definition
 * @return {object} result
 */
module.exports.processDateTime = (input, attributes) => {
  for (let key of Object.keys(input)) {
    if (["Date", "Time", "DateTime"].includes(attributes[key])) {
      input[key] = input[key].toISOString();
    } else if (["[Date]", "[Time]", "[DateTime]"].includes(attributes[key])) {
      input[key] = input[key].map((str) => str.toISOString());
    }
  }
  return input;
};

/**
 * searchConditionsToNeo4j - translates search conditions as given in the graphQl query to 'where' options
 * @param {object} search search argument for filtering records
 * @param {object} dataModelDefinition definition as specified in the model
 * @return {object} 'where' options
 */
module.exports.searchConditionsToNeo4j = (search, dataModelDefinition) => {
  let whereOptions = "";
  if (search !== undefined && search !== null) {
    if (typeof search !== "object")
      throw new Error('Illegal "search" argument type, it must be an object.');
    let arg = new searchArg(search);
    whereOptions = " WHERE " + arg.toNeo4j(dataModelDefinition.attributes);
  }
  return whereOptions;
};

/**
 * orderConditionsToNeo4j - build the sort object for default pagination. Default order is by idAttribute ASC
 * @param {array} order order array given in the graphQl query
 * @param {string} idAttribute idAttribute of the model
 * @param {boolean} isForwardPagination forward pagination
 * @returns {object} orderOptions
 */
module.exports.orderConditionsToNeo4j = (
  order,
  idAttribute,
  isForwardPagination
) => {
  let orderOptions = "ORDER BY ";
  if (order !== undefined) {
    orderOptions += order
      .map((orderItem) => "n." + orderItem.field + " " + orderItem.order)
      .join(", ");
  }
  if (
    !order ||
    !order.map((orderItem) => orderItem.field).includes(idAttribute)
  ) {
    const idOption = isForwardPagination
      ? "n." + idAttribute + " ASC"
      : "n." + idAttribute + " DESC";
    orderOptions += orderOptions === "ORDER BY " ? idOption : ", " + idOption;
  }
  return orderOptions;
};

/**
 * mergeFilters - merge two filters into a new filter.
 * @param {object} filterA first where options
 * @param {object} filterB second where options (without 'where')
 * @param {object} operator operator to combine filterA and filterB. Valid operators are 'and' or 'or'. default is 'and'.
 */
module.exports.mergeFilters = function (filterA, filterB, operator) {
  if (operator && (operator !== "and" || operator !== "or"))
    throw new Error('Only "and" or "or" operators are valid.');
  let mergeOp = operator ? operator : "AND";
  //check: no arguments
  if (!filterA && !filterB) {
    return "";
  }
  //check: only whereB
  if (!filterA && filterB) {
    return " WHERE " + filterB;
  }
  //check: only whereA
  if (filterA && !filterB) {
    return filterA;
  }
  //check: types
  if (typeof filterA !== "string" || typeof filterB !== "string") {
    throw new Error("Illegal arguments provided to mergeFilters function.");
  }
  return `${filterA} ${mergeOp} (${filterB})`;
};

/**
 * parseOrderCursor - Parse the order options and return the where statement for cursor based pagination (forward)
 *
 * Returns a set of {AND / OR} conditions that cause a ‘WHERE’ clause to deliver only the records ‘greater than’ a given cursor.
 *
 * @param  {string} order  Order options. Must contains at least the entry for 'idAttribute'.
 * @param  {Object} cursor Cursor record taken as start point(exclusive) to create the filter object.
 * @param  {String} idAttribute  idAttribute of the calling model.
 * @param  {[string]} orderFields  Order fields. Must contains at least the entry for 'idAttribute'.
 * @param  {Boolean} includeCursor Boolean flag that indicates if a strict or relaxed operator must be used for produce idAttribute conditions.
 * @param  {object} dataModelDefinition  definition as specified in the model
 * @return {Object}        filter object which is used for retrieving records after the given cursor holding the order conditions.
 */
module.exports.parseOrderCursor = (
  order,
  cursor,
  idAttribute,
  orderFields,
  includeCursor,
  dataModelDefinition
) => {
  /**
   * Checks
   */
  //idAttribute:
  if (idAttribute === undefined || idAttribute === null || idAttribute === "") {
    return "";
  }
  //order: must have idAttribute
  if (!order.includes(idAttribute)) {
    return "";
  }
  //cursor: must have idAttribute
  if (
    cursor === undefined ||
    cursor === null ||
    typeof cursor !== "object" ||
    cursor[idAttribute] === undefined
  ) {
    return "";
  }

  if (!orderFields.includes(idAttribute)) {
    orderFields.push(idAttribute);
  }
  //index of base step: default -> idAttribute
  let last_index = orderFields.length - 1;
  //index of the starting recursive step
  let start_index = orderFields.length - 2;
  const stringType = ["String", "Date", "DateTime", "Time"];

  /*
   * Base step.
   */
  //set operator according to order type.
  let type = dataModelDefinition[orderFields[last_index]];
  let tmp_index =
    order.indexOf(orderFields[last_index] + " ") +
    orderFields[last_index].length +
    1;
  let operator = order[tmp_index] === "A" ? ">=" : "<=";
  //set strictly '>' or '<' for idAttribute (condition (1)).
  if (!includeCursor && orderFields[last_index] === idAttribute) {
    operator = operator.substring(0, 1);
  }

  /*
   * Produce condition for base step.
   */
  let filter = `n.${orderFields[last_index]} ${operator} `;
  let value = cursor[orderFields[last_index]];

  filter += stringType.includes(type) ? `'${value}'` : value;
  /*
   * Recursive steps.
   */
  for (let i = start_index; i >= 0; i--) {
    /**
     * Set operators
     */
    //set relaxed operator '>=' or '<=' for condition (2.a or 2.b)
    type = dataModelDefinition[orderFields[i]];

    tmp_index = order.indexOf(orderFields[i] + " ") + orderFields[i].length + 1;
    operator = order[tmp_index] === "A" ? ">=" : "<=";
    //set strict operator '>' or '<' for condition (2.a).
    let strict_operator = order[tmp_index] === "A" ? ">" : "<";
    //set strictly '>' or '<' for idAttribute (condition (1)).
    if (!includeCursor && orderFields[i] === idAttribute) {
      operator = operator.substring(0, 1);
    }

    /**
     * Produce: AND/OR conditions
     */
    value = cursor[orderFields[i]];
    value = stringType.includes(type) ? `'${value}'` : value;
    filter = `(n.${orderFields[i]} ${operator} ${value}) AND (
      (n.${orderFields[i]} ${strict_operator} ${value}) OR (
      ${filter}))`;
  }
  return filter;
};

/**
 * cursorPaginationArgumentsToNeo4j - translate cursor based pagination object to the filter object.
 * merge the original searchArguement and those needed for cursor-based pagination
 * @see parseOrderCursor
 *
 * @param {object} pagination cursor-based pagination object
 * @param {string} sort order options
 * @param {string} filter where options
 * @param {[string]} orderFields order fields
 * @param {string} idAttribute idAttribute of the model
 * @param {object} dataModelDefinition  definition as specified in the model
 */
module.exports.cursorPaginationArgumentsToNeo4j = function (
  pagination,
  sort,
  filter,
  orderFields,
  idAttribute,
  dataModelDefinition
) {
  if (pagination) {
    if (pagination.after || pagination.before) {
      let cursor = pagination.after ? pagination.after : pagination.before;
      let decoded_cursor = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf-8")
      );
      let filterB = module.exports.parseOrderCursor(
        sort,
        decoded_cursor,
        idAttribute,
        orderFields,
        pagination.includeCursor,
        dataModelDefinition
      );
      filter = module.exports.mergeFilters(filter, filterB);
    }
  }
  return filter;
};
