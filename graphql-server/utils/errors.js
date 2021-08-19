const {
  GraphQLError
} = require('graphql');
const helper = require('./helper')
const globals = require('../config/globals');

/**
 * Class representing a Zendro Error containing according to GraphQL Errors spec.
 * @extends Error
 */
module.exports.ZendroError = class ZendroError extends Error {
  /**
   * Create a Zendro Error.
   * @param {String} message - A message describing the Error for debugging purposes..
   * @param {Array} path - An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   * @param {Array} locations - An array of { line, column } locations within the source GraphQL document
   * which correspond to this error.
   * @param {Object} extensions - Extension fields to add to the formatted error.
   *
   * @return {ZendroError} An instance of ZendroError with extensions always
   * initialized to at least an empty object.
   */
  constructor({
    message,
    path,
    locations,
    extensions
  }) {
    super();
    this.message = message;
    this.path = path;
    this.locations = locations;
    this.extensions = helper.isNotUndefinedAndNotNull(extensions) ?
      extensions : {}
  }
}

/**
 * handleRemoteErrors - handles incoming errors from remote servers
 * @param {Array} errs - Array of errors (benign) or single more serious error send in the response from the remote server
 * @param {String} remoteServiceUrl - url of the remote service that had errors
 * @return {ZendroError} If serious single Error return as Zendro Error, else build custom ZendroError
 * with given message and Errors in Extensions
 */
module.exports.handleRemoteErrors = function(errs, remoteServiceUrl) {
  if (helper.isNonEmptyArray(errs)) {
    return errs.map(function(remoteError) {
      // Making the 'remoteError' an instance of ZendroError ensures:
      // 1. message, path, locations, and extensions are retained, and
      // 2. extensions are initialized, if the were not already
      let remoteZendroError = new module.exports.ZendroError(remoteError);
      // add the information that the 'remoteError' was received from another
      // web-service
      remoteZendroError.extensions.receivedFrom = helper.isNonEmptyArray(remoteZendroError.extensions.receivedFrom) ? remoteZendroError.extensions.receivedFrom.concat(remoteServiceUrl) : [remoteServiceUrl];
      return remoteZendroError
    })
  } else {
    return null
  }
}

/**
 * isRemoteGraphQlError - checks if an Error is a remote GraphQLError
 * @param {Error} error - The error to check
 *
 * @return {Boolean} True if the error has the properties of a GraphQLError send by a remote Server
 */
module.exports.isRemoteGraphQlError = function(err) {
  return err.response && err.response.data && Array.isArray(err.response.data
    .errors)
}

/**
 * stringifyCompletely - completely stringifies an error (including non-enumerable Keys)
 * @param {Error} error - The error to stringify
 * @param replacer - Either a function or an array used to transform the result. The replacer is called for each item.
 * @param space - Optional. Either a String or a Number. A string to be used as white space (max 10 characters),
 * or a Number, from 0 to 10, to indicate how many space characters to use as white space.
 * @return {String} String of the error to cast
 */
module.exports.stringifyCompletely = function(error, replacer, space) {
  let allKeys = Reflect.ownKeys(error);
  let errorMap = {};
  for (let key of allKeys) {
    errorMap[`${key}`] = error[`${key}`];
  }
  return JSON.stringify(errorMap, replacer, space);
}

/**
 * customErrorLog - Log the errors depending on the env Variable "ERROR_LOG".
 *                  Default is "compact". If specifically set to "verbose" errors
 *                  will be logged with all properties (including graphQLError properties)
 *
 * @param {Error} error - error to be logged
 */
module.exports.customErrorLog = function(error) {
  if (globals.ERROR_LOG.toUpperCase() === "VERBOSE") {
    console.error(module.exports.stringifyCompletely(error, null, 2))
  } else { //if not verbose default should be "compact", if for some reason another env was given it should still be compact
    if(error.stack){
        console.error(error.stack);
    }

    console.error(JSON.stringify(error,customReplaceErrors))
  }
}

/**
 * Class representing a BeningError reporter which is able to add benignErrors to the context.
 */
module.exports.BenignErrorReporter = class BenignErrorReporter {
  /**
   * Create a BenignErrorReporter.
   * @param {Object} context - holds contextual information like the resquest query and user info
   *
   * @return {BenignErrorReport} instance of a BenignErrorReporter
   */
  constructor(context) {
    this.graphQlContext = context;
  }

  /**
   * reportError - adds the passed errors to the graphQLContext
   * @param errors - errors from the httpResponse of another graphQL server
   */
  reportError(errors) {
    if (helper.isNotUndefinedAndNotNull(errors)) {
      if (Array.isArray(errors)) {
        this.graphQlContext.benignErrors.push(...errors);
      } else {
        this.graphQlContext.benignErrors.push(errors);
      }
    }
  }
}

/**
 * handleErrorsInGraphQlResponse - calls the benignErrorReporter to add the Errors
 * @param {Object} httpResponseData - Data send from the remote server, that might contain benignErrors
 * @param {BenignErrorReporter} benignErrorReporter - The BenignErrorReporter that holds the context
 */
module.exports.handleErrorsInGraphQlResponse = function(httpResponseData, benignErrorReporter) {
  // check if has errors
  if (helper.isNonEmptyArray(httpResponseData.errors)) {
    benignErrorReporter.reportError(httpResponseData.errors)
  }
}

/**
 * defaultBenignErrorReporter - If no benignErrorReporter is given this default reporter, which just throws the errors
 * will instead be used (Used mainly for being able to require a model independently of a given context)
 */
module.exports.defaultBenignErrorReporter = {
  reportError: function(errors) {
    let errorReport = "";
    errors.forEach(error => errorReport = errorReport.concat(`${error}, `));
    throw new Error(errorReport);
  }
}

/**
 * getDefaultBenignErrorReporterIfUndef - checks whether a benignErrorReporter is given (one that actually holds a context)
 * if not return the defaultBenignErrorReporter Object
 * @param {BenignErrorReporter} benignErrorReporter - The BenignErrorReporter that holds the context
 */
module.exports.getDefaultBenignErrorReporterIfUndef = function(
  benignErrorReporter) {
  return (!helper.isNotUndefinedAndNotNull(benignErrorReporter)) ? module
    .exports.defaultBenignErrorReporter : benignErrorReporter
}

/**
* See GraphQL Error spec: <http://spec.graphql.org/draft/#sec-Errors>

* formatGraphQLErrorExtensions - formats the extensions object put into the GraphQLError
* @param {object} error the error generated by graphql-js or a benign error
*
* @return {object} the extensions object.
*/
module.exports.formatGraphQLErrorExtensions = function(error) {
  if (helper.isNotUndefinedAndNotNull(error.extensions)){
    return error.extensions
  }else if(error.message === 'validation failed'){
    return {validationErrors: error.originalError ? error.originalError.errors : error.errors }
  }else if(error.name === "SequelizeValidationError"){
    return {validationErrors: error.originalError.errors}
  }
}

/**
* ifTimeOutErrorAdjustMessage - checks if a the request failed because of a time-out and adjusts
* the error message accordingly
* @param {Error} error error received from request to remote server
* @param {String} url url of the remote service
*/
module.exports.ifTimeOutErrorAdjustMessage = function( error, url ) {
  if (error.code === 'ECONNABORTED') {
    error.message = `Time out exceeded trying to reach server ${url}`
  }
}

/**
* handleCaughtErrorAndBenignErrors - handles errors caught by a request to a remote server
* checks both for non-remote and remote errors. non-remote GraphQlErrors will be thrown.
* Errors in the response frome the remote server are added to benignErrors
*
* @param {Error} error caught error
* @param {BenignErrorReporter} benignErrorReporter to use for reporting the caught Errors as benignErrors
* to the user
* @param {Error} url url of the remote service
*/
module.exports.handleCaughtErrorAndBenignErrors = function(error, benignErrorReporter, url) {
  if (!module.exports.isRemoteGraphQlError(error)) {
    // Non remote error:
    // Was it a time out of the connection?
    module.exports.ifTimeOutErrorAdjustMessage( error )
    throw error
  } else {
    // STATUS CODE is NOT 200,
    // which means a rather serious error was sent by the remote server.
    benignErrorReporter.reportError(module.exports.handleRemoteErrors(error.response.data.errors, url));
    throw new Error(`Web-service ${url} returned attached (see below) error(s).`)
  }
}

/**
 * customReplaceErrorrs - custom replacer function for JSON.stringify used for Error reporting.
 *
 * @param key
 * @param {Object} value - value to stringify
 */
function customReplaceErrors(key,value) {
  if (value instanceof Error) {
    var error = {};
    Object.getOwnPropertyNames(value).forEach(function (key) {
      if(key !== "stack" && key !== "nodes") {
        error[key] = value[key];
      }
    });
    return error;
  }
  return value;
}


module.exports.handleError = function(error) {
  throw new Error(error);
}

/*constructErrorForLogging = function(error) {
  if(error.message){
    return transformDetailsAndReturnError(error, error.message);
  }else if(error.name === "SequelizeValidationError"){
    return transformDetailsAndReturnError(error, "Validation error.");
  }else if(error.code === 'ECONNABORTED' && error.url!== undefined){
    return new GraphQLError(`Time out exceeded trying to reach server ${error.url}`);
  }else{
    return transformDetailsAndReturnError(error, "");
  }
}*/
