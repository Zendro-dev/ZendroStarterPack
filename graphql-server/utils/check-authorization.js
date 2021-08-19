const jwt =  require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/globals');


/**
 * @function - Given a context this function check if the user(implicit in context)
 * is allowed to perform 'permission' action to the 'resource' model.
 *
 * @param  {object} context    context object contains the request info and the acl rules.
 * @param  {string} resource   resource to which the user wants to perform an action (i.e. a model).
 * @param  {string} permission action that the user wants to perform to resourse (i.e. read, edit, create).
 * @return {promise}            it will resolve true if within the context the user is allowed to perform 'permission' action to the 'resource' model.
 */
module.exports =  function( context, resource, permission ) {
  //if there's not authorization rules set
  if (context.acl == null) //return true;
  {
    return Promise.resolve(true);
  }

  let token_bearer =  context.request.headers["authorization"];
  const token = token_bearer && typeof token_bearer === "string" ? token_bearer.replace("Bearer ","") : undefined;
  console.log("TOKEN",typeof token, token);
  try{
    //Identify user from context
    let decoded = jwt.verify(token, JWT_SECRET);

    //check for permissions from specific roles
     return context.acl.areAnyRolesAllowed(decoded.roles, resource, permission);
  }catch(err){
    //invalid token
    console.log("invalid token...");
    console.log(err);
    throw new Error(err);
    //return false;
  }
}
