const searchArg = require('./search-argument');
// const {ObjectId} = require('mongodb')
/**
 * orderConditionsToMongoDb - build the sort object for default pagination. Default order is by idAttribute ASC
 * @param {array} order order array given in the graphQl query
 * @param {string} idAttribute idAttribute of the model
 *
 * @returns {object} sort object
 */
module.exports.orderConditionsToMongoDb = function(order, idAttribute, isForwardPagination){
  let sort = {};
  if (order !== undefined) {
    for (let item of order){
      if (item.order==="ASC"){
        sort[item.field] = 1
      } else {
        sort[item.field] = -1
      }
    }
  }
  if (!Object.keys(sort).includes(idAttribute)) {
    sort[idAttribute] = isForwardPagination ? 1 : -1
  }
  return sort;
}

/**
 * 
 * @param {*} search 
 */
module.exports.searchConditionsToMongoDb = function(search){

  let filter;
  if (search !== undefined && search !== null) {    
    if (typeof search !== 'object') {
        throw new Error('Illegal "search" argument type, it must be an object.');
    }
    let arg = new searchArg(search);
    filter = arg.toMongoDb();
  }
  return filter;
}

/**
 * mergeMongoDbFilters - merge two filters into a new filter.
 * @param {object} filterA first filter object of the form: {field: {[OP]: "value"}}
 * @param {object} filterB second filter object of the form: {field: {[OP]: "value"}}
 * @param {object} operator operator to combine filterA and filterB. Valid operators are 'and' or 'or'. default is 'and'.
 */
module.exports.mergeMongoDbFilters = function (filterA, filterB, operator) {
  if(operator && (operator !=='and' || operator !=='or')) throw new Error('Only "and" or "or" operators are valid.');
  let mergeOp = operator ? "$"+operator : '$and';
  //check: no arguments
  if(!filterA && !filterB) {
    return {};
  }
  //check: only whereB
  if(!filterA && filterB) {
    return filterB;
  }
  //check: only whereA
  if(filterA && !filterB) {
    return filterA;
  }
  //check: types
  if(typeof filterA !== 'object' || typeof filterB !== 'object') {
    throw new Error('Illegal arguments provided to mergeMongoDbFilters function.');
  }
  return { [mergeOp]: [filterA, filterB] }
}

/**
 * parseOrderCursor - Parse the order options and return the where statement for cursor based pagination (forward)
 *
 * Returns a set of {AND / OR} conditions that cause a ‘WHERE’ clause to deliver only the records ‘greater that’ a given cursor.
 *
 * @param  {Array} order  Order entries. Must contains at least the entry for 'idAttribute'.
 * @param  {Object} cursor Cursor record taken as start point(exclusive) to create the filter object.
 * @param  {String} idAttribute  idAttribute of the calling model.
 * @param  {Boolean} includeCursor Boolean flag that indicates if a strict or relaxed operator must be used for produce idAttribute conditions.
 * @return {Object}        filter object which is used for retrieving records after the given cursor holding the order conditions.
 */
module.exports.parseOrderCursor = function(order, cursor, idAttribute, orderFields, includeCursor){
  /**
   * Checks
   */
  //idAttribute:
  if(idAttribute===undefined||idAttribute===null||idAttribute===''){
    return {};
  }
  //order: must have idAttribute
  if(!Object.keys(order).includes(idAttribute)) {
      return {};
  }
  //cursor: must have idAttribute
  if(cursor===undefined||cursor===null||typeof cursor!=='object'||cursor[idAttribute] === undefined){
    return {};
  }

  if (!orderFields.includes(idAttribute)){
    orderFields.push(idAttribute)
  }
  //index of base step
  let last_index = orderFields.length-1;
  //index of the starting recursive step
  let start_index = orderFields.length-2;

  /*
    * Base step.
    */
  //set operator according to order type.
  let operator = order[orderFields[last_index]] === 1 ? 'gte' : 'lte';
  //set strictly '>' or '<' for idAttribute (condition (1)).
  if (!includeCursor && orderFields[last_index] === idAttribute) { operator = operator.substring(0, 2); }

  /*
    * Produce condition for base step.
    */
  let filter = {
    [orderFields[last_index]]: { ["$"+operator]: cursor[orderFields[last_index]] }
  }

  /*
    * Recursive steps.
    */
  for( let i= start_index; i>=0; i-- ){

    /**
     * Set operators
     */
    //set relaxed operator '>=' or '<=' for condition (2.a or 2.b)
    operator = order[orderFields[i]] === 1 ? 'gte' : 'lte';
    //set strict operator '>' or '<' for condition (2.a).
    let strict_operator = order[orderFields[i]] === 1 ? 'gt' : 'lt';
    //set strictly '>' or '<' for idAttribute (condition (1)).
    if(!includeCursor && orderFields[i] === idAttribute){ operator = operator.substring(0, 2);}

    /**
     * Produce: AND/OR conditions
     */
    filter = {
      ['$and'] :[
        { [orderFields[i] ] : { ["$"+operator]: cursor[ orderFields[i] ] } },
        { ['$or'] :[
          { [orderFields[i]]: { ["$"+strict_operator]: cursor[ orderFields[i] ]} },
          filter  ]
        }
      ]
    }    
  }
  return filter
}

/**
 * cursorPaginationArgumentsToMongoDb - translate cursor based pagination object to the filter object.
 * merge the original searchArguement and those needed for cursor-based pagination
 * @see parseOrderCursor
 *
 * @param {object} pagination cursor-based pagination object
 * @param {object} sort sort object
 * @param {object} filter filter object
 * @param {string} idAttribute idAttribute of the model
 */
module.exports.cursorPaginationArgumentsToMongoDb = function(pagination, sort, filter, orderFields, idAttribute) {
  if (pagination) {
    if (pagination.after || pagination.before){
      let cursor = pagination.after ? pagination.after : pagination.before;
      let decoded_cursor = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
      let filterB = module.exports.parseOrderCursor(sort, decoded_cursor, idAttribute, orderFields, pagination.includeCursor);
      filter = module.exports.mergeMongoDbFilters(filter, filterB);
    }
  }
  return filter
}
