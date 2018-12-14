const jwt =  require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = 'something-secret';

module.exports = function( context, resource, permission ) {
  //if there's not authorization rules set
  if (context.acl == null) return true;

  let token =  context.request.headers["authorization"];
  try{
    //Identify user from context
    let decoded = jwt.verify(token, secret);
    //check for permissions of that specific user
    let allowed = context.acl.isAllowed(decoded.id, resource, permission);
    console.log(typeof decoded.id, ' * ' ,decoded.id);
    if(allowed){
      return true;
    }else{
      //no permission for user
      console.log("Permission dennied...");
      return false;
    }
  }catch(err){
    //invalid token
    console.log("invalid token...");
    return false;
  }
}
