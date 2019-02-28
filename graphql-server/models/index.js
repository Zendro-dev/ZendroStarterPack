
  const fs = require('fs');
  const path = require('path')
  sequelize = require('../connection');

  var models = {};

  //grabs all the models in your models folder, adds them to the models object
  fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });
  //Important: creates associations based on associations defined in associate function in the model files
  Object.keys(models).forEach(function(modelName) {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  //update tables with association (temporary, just for testing purposes)
  //this part is suppose to be done in the migration file
  //sequelize.sync({force: true});
  module.exports = models;
  