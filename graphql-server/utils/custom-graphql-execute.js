const rewire = require('rewire');
const execute = rewire('graphql/execution/execute')

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _isPromise = require('graphql/jsutils/isPromise.js');
var _isPromise2 = _interopRequireDefault(_isPromise);

/**
 * Given a completed execution context and data, build the { errors, data }
 * response defined by the "Response" section of the GraphQL specification.
 */
const buildResponse = function (context, data) {
  if ((0, _isPromise2.default)(data)) {
    return data.then(function (resolved) {
      return buildResponse(context, resolved);
    });
  }
  if (context.contextValue.benignErrors.length > 0) {
    context.errors = context.errors.concat(context.contextValue.benignErrors)
  }
    return context.errors.length === 0 ? { data: data } : { errors: context.errors, data: data };
}

execute.__set__('buildResponse', buildResponse)
module.exports = execute