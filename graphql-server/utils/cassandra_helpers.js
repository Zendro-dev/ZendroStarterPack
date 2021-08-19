
const _ = require('lodash');
const { isNotUndefinedAndNotNull, base64Decode } = require('./helper');
const searchArg = require('./search-argument');

/**
 * order records records recieved from multiple cassandra-adapters. ordering by token
 * @param {array} matchingRecords 
 */
module.exports.orderCassandraRecords = function(matchingRecords) {
  return _.sortBy(matchingRecords, [(record) => {return record.toke.toNumber()}]);
}

/**
 * 
 * @param {object} search zendro search
 * @param {object} definition definition as specified in the model
 * @param {boolean} allowFiltering set cql allowFiltering
 * 
 * @returns {string} cql WHERE ... string
 */
module.exports.searchConditionsToCassandra = function(search, definition, allowFiltering){

  let whereOptions = '';
  if (search !== undefined && search !== null) {    
    if (typeof search !== 'object') {
        throw new Error('Illegal "search" argument type, it must be an object.');
    }
    let arg = new searchArg(search);
    whereOptions = ' WHERE ' + arg.toCassandra(definition.attributes, allowFiltering) + ';';
  }
  return whereOptions;
}

/**
 * In this function, a special operator is used: "tgt", meaning "TOKEN > TOKEN".
 * This operator is implemented in utils/search-argument.js, toCassandra(idAttribute, allowFiltering)
 *
 * The Cassandra database is ordered by the TOKEN of the ID value, so if we want to cut away entries above the cursor,
 * we need to enforce the condition TOKEN(id) > TOKEN(cursor_id), which is realized here by: id TGT cursor_id
 * @param {object} search zendro search
 * @param {object} pagination pagination argument given to the query
 * @param {String} idAttribute idAttribute of the model calling this funtion
 */
module.exports.cursorPaginationArgumentsToCassandra = function(search, pagination, idAttribute) {
  
  let offsetCursor = pagination ? pagination.after : null;
  let operator = pagination.includeCursor ? 'tget' : 'tgt';
  let cassandraSearch = Object.assign({},search);
  if (isNotUndefinedAndNotNull(offsetCursor)) {
    let decoded_cursor = JSON.parse(base64Decode(offsetCursor));
    let cursorId = decoded_cursor[idAttribute];
    let cursorSearchCondition  = {
        field: idAttribute,
        value: cursorId,
        operator: operator,
        search: undefined
    };
    if (isNotUndefinedAndNotNull(search)) {
        // -- Use *both* the given search condition and the cursor --
        cassandraSearch = {
            operator: 'and',
            search: [search, cursorSearchCondition]
        };
    } else {
        // -- Use only the cursor --
        cassandraSearch = cursorSearchCondition;
    }
  }
  return cassandraSearch;
}

