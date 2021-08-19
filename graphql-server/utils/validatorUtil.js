const gd = require('graphql-iso-date')
const Ajv = require('ajv')

/**
 * ifHasValidatorFunctionInvoke - checks if data model has a validator function with
 * the given name, and apply that function
 *
 * @param  {string} validatorFunction Name of the validator function
 * @param  {object} dataModel The empty data model object
 * @param  {object} data JSON data to be inserted into the dataModel
 * @return {Promise} The result of invoking the respective validator, or
 *                   undefined if no validator was found to be registered
 *
 */

module.exports.ifHasValidatorFunctionInvoke = async function( validatorFunction, dataModel, data) {
    if (typeof dataModel.prototype[validatorFunction] === "function") {
      try{
        return await dataModel.prototype[validatorFunction](data);
      }catch( err) {
        throw err;
      }
    }
};


/**
 * validateData - It will check if validation methods exist and swith is turned on for the given model, if so, it will validate data
 *
 * @param  {string} validatorFunction Name of the validator function
 * @param  {object} dataModel         Data model which 'data' belongs to.
 * @param  {object} data              Attributes data from a record to be validated. Note: in case of delete validation only id attribute might be used.
 * @return {object}                   If no error occurs, then the same data will be returned, other wise error will be thrown.
 */
module.exports.validateData = async function(validatorFunction, dataModel, data ){
  if(typeof dataModel.prototype[validatorFunction] === "function"
     && typeof dataModel.prototype['validationControl'] === 'object'
      && dataModel.prototype['validationControl'][validatorFunction]){
        await dataModel.prototype[validatorFunction](data);
  }
  return data;
}


/**
 * bulkValidateData - It will check if validation methods exist and swith is turned on, if so, it will validate data
 *
 * @param  {string} validatorFunction   Name of the validator function
 * @param  {object} dataModel           Data model which 'data' belongs to.
 * @param  {Array} data                Array of records to be validated.
 * @param  {object} benignErrorReporter Error reporter in case any of the records doesn't pass validation.
 * @return {Array}                     Filtered data by validation will be returned, the records which doesn't pass validation are added to the error reporter.
 */
module.exports.bulkValidateData = async function(validatorFunction, dataModel, data, benignErrorReporter){
  let validatedData = data;
  if(typeof dataModel.prototype[validatorFunction] === "function"
     && typeof dataModel.prototype['validationControl'] === 'object'
      && dataModel.prototype['validationControl'][validatorFunction]){
        validatedData = [];
        for await( record of data){
          try{
            await dataModel.prototype[validatorFunction](record);
            validatedData.push(record);
          }catch(error){
            if(error.message === 'validation failed'){
              error.errors = error.errors.map( e => { e['validatedRecordId '] = { [dataModel.idAttribute()] : record.getIdValue() }; return e;  } )
            }
            benignErrorReporter.reportError(error);
          };
        }

      }
  return validatedData;
}


/**
 * Adds AJV asynchronous keywords to the argument AJV instance that define ISO
 * Date, ISO Time, and ISO DateTime strings or the respective GraphQL instances
 * (see package 'graphql-iso-date'). Use in a schema as in the following
 * example: let schema = { '$async': true, properties: { startDate: { isoDate:
 * true } } }
 *
 * @param {object} ajv - An instance of AJV (see package 'ajv' for details.
 *
 * @return {object} the modified instance of ajv. As Javascript uses references
 * this return value can be ignored, as long as the original argument is kept
 * and used.
 */
module.exports.addDateTimeAjvKeywords = function(ajv) {
  ajv.addKeyword('isoDate', {
    async: true,
    compile: function(schema, parentSchema) {
      return async function(data) {
        try {
          gd.GraphQLDate.serialize(data);
          return true
        } catch (e) {
          return new Promise(function(resolve, reject) {
            return reject(new Ajv.ValidationError([{
              keyword: 'isoDate',
              message: 'Must be a GraphQLDate instance or a ISO Date formatted string (e.g. "1900-12-31").',
              params: {
                'keyword': 'isoDate'
              }
            }]))
          })
        }
      }
    },
    errors: true
  })

  ajv.addKeyword('isoTime', {
    async: true,
    compile: function(schema, parentSchema) {
      return async function(data) {
        try {
          gd.GraphQLTime.serialize(data);
          return true
        } catch (e) {
          return new Promise(function(resolve, reject) {
            return reject(new Ajv.ValidationError([{
              keyword: 'isoTime',
              message: 'Must be a GraphQLTime instance or a ISO Time formatted string (e.g. "13:56:45Z" or "13.56.45.1982Z").',
              params: {
                'keyword': 'isoTime'
              }
            }]))
          })
        }
      }
    },
    errors: true
  })

  ajv.addKeyword('isoDateTime', {
    async: true,
    compile: function(schema, parentSchema) {
      return async function(data) {
        try {
          gd.GraphQLDateTime.serialize(data);
          return true
        } catch (e) {
          return new Promise(function(resolve, reject) {
            return reject(new Ajv.ValidationError([{
              keyword: 'isoDateTime',
              message: 'Must be a GraphQLDateTime instance or a ISO Date-Time formatted string (e.g. "1900-12-31T23:59:59Z" or "1900-12-31T23:59:59.1982Z").',
              params: {
                'keyword': 'isoDateTime'
              }
            }]))
          })
        }
      }
    },
    errors: true
  })

  return ajv
}

/**
 * Adds AJV asynchronous keyword to the custom validation function 
 *
 * @param {object} ajv - An instance of AJV (see package 'ajv' for details).
 *
 * @return {object} the modified instance of ajv. As Javascript uses references
 * this return value can be ignored, as long as the original argument is kept
 * and used.
 */
module.exports.addValidatorFunc = function addValFuncKeyword(ajv) {
  ajv.addKeyword('asyncValidatorFunction', {
    async: true,
    errors: 'full',
    compile: function(schema, parentSchema) {
      return async function(data) {
        return await schema(data)
      }
    }
  })
  return ajv
}