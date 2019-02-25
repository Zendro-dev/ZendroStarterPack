
class customArrayError extends Error {
  constructor(errors_array, message){
    super();
    this.message = message;
    this.errors = errors_array;
  }
}

handleError = function(error){
  if(error.name === "SequelizeValidationError"){
      throw new customArrayError(error.errors, "Validation error");
  }else{
      throw new Error(error)
  }
}

module.exports = { handleError}
