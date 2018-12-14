var fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const inflection = require('inflection');
const jsb = require('js-beautify').js_beautify;
const {promisify} = require('util');
const ejsRenderFile = promisify( ejs.renderFile );

associations_type = {
  "many" : ['sql_hasMany', 'sql_belongsToMany','cross_hasMany'],
  "one" : ['sql_hasOne', 'sql_belongsTo', 'cross_hasOne','cross_belongsTo']
}

/*
association_storage = {
  "sql" : ['sql_hasMany', 'sql_hasOne', 'sql_belongsTo', 'sql_belongsToMany'],
  "cross" : ['cross_hasMany', 'cross_hasOne']
}
*/

parseFile = function(jFile){
  let data=fs.readFileSync(jFile, 'utf8');
  let words=JSON.parse(data);
  return words;
}

isEmptyObject = function(obj){
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// Generate the Javascript code (GraphQL-schema/resolvers/Sequelize-model) using EJS templates
module.exports.generateJs = async function(templateName, options) {
  let renderedStr = await ejsRenderFile(__dirname + '/views/' +
    templateName +
    '.ejs', options, {})
  let prettyStr = jsb(renderedStr)
  return prettyStr;
}

attributesToString = function(attributes){
  let str_attributes="";
  if(attributes==='undefined' || isEmptyObject(attributes)) return str_attributes;

  for(key in attributes)
  {
    str_attributes+= key + ': ' + attributes[key] + ', '
  }

  return str_attributes.slice(0,-2);
}


attributesArrayString = function(attributes){
  let array_attributes = ["id"];

  for(key in attributes){
    if(attributes[key]=== 'String')
    {
      array_attributes.push(key);
    }
  }

  return array_attributes;
}


writeSchemaCommons = function(dir_write){

  let commons = `module.exports = \`

  enum Operator{
    like
    or
    and
    eq
    between
    in
  }

  enum Order{
    DESC
    ASC
  }

  input typeValue{
    type: String
    value: String!
  }

  input paginationInput{
    limit: Int
    offset: Int
  }

\`;`;

  fs.writeFile(dir_write + '/schemas/' +  'commons.js' , commons, function(err) {
    if (err)
      return console.log(err);
    });
}

writeIndexModelsCommons = function(dir_write){

  let index =  `
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
  `;

  fs.writeFile(dir_write + '/models/' +  'index.js' , index, function(err) {
    if (err)
      return console.log(err);
    });
}

convertToType = function(many, model_name)
{
  if(many)
  {
    return '[ '+ model_name +' ]';
  }

  return model_name;
}

module.exports.getOptions = function(dataModel)
{
  //let dataModel = parseFile(json_file);
  //console.log(dataModel.associations);
  let opts = {
    name : dataModel.model,
    nameCp: inflection.capitalize(dataModel.model),
    storageType : dataModel.storageType.toLowerCase(),
    table : inflection.pluralize(dataModel.model.toLowerCase()),
    nameLc: dataModel.model.toLowerCase(),
    namePl: inflection.pluralize(dataModel.model.toLowerCase()),
    namePlCp: inflection.pluralize(inflection.capitalize(dataModel.model)),
    attributes: dataModel.attributes,
    attributesStr: attributesToString(dataModel.attributes),
    associations: parseAssociations(dataModel.associations, dataModel.storageType.toLowerCase()),
    arrayAttributeString: attributesArrayString(dataModel.attributes)
  }
  return opts;
}

parseAssociations = function(associations, storageType)
{
  associations_info = {
    "schema_attributes" : {
      "many" : {},
      "one" : {}
    },
    "mutations_attributes" : {},
    "explicit_resolvers" : {
      "belongsTo" : [],
      "hasOne" : [],
      "hasMany" : []
    },
    "implicit_associations" : {
      "belongsTo" : [],
      "hasOne" : [],
      "hasMany" : [],
      "belongsToMany" : []
    }
  }

  if(associations!==undefined){
    Object.entries(associations).forEach(([name, association]) => {
        association.targetStorageType = association.targetStorageType.toLowerCase();
        //let target_schema = association.target;
        let type = association.type.split("_")[1];
        if(type === "belongsTo"){ //adds column and attribute to source model
          associations_info.mutations_attributes[association.targetKey] = "Int";
        }

        if(associations_type["many"].includes(association.type) )
        {
          associations_info.schema_attributes["many"][name] = [ association.target, inflection.capitalize(association.target), inflection.capitalize(inflection.pluralize(association.target))];
        }else if(associations_type["one"].includes(association.type))
        {
          associations_info.schema_attributes["one"][name] = association.target;
        }else{
          console.log("Association type"+ association.type + "not supported.");
          return;
        }

        let assoc = association;
        assoc["target_pl"] = inflection.pluralize(association.target);
        assoc["target_cp"] = inflection.capitalize(association.target);
        assoc["target_cp_pl"] = inflection.capitalize(inflection.pluralize(association.target));
        //in this case handle the resolver via sequelize
        if(storageType === 'sql' && association.targetStorageType === 'sql' )
        {
          associations_info.implicit_associations[type].push( assoc );
        }else{ //handle the association via resolvers
          associations_info.explicit_resolvers[type].push( assoc );
        }
      });

      //console.log(associations_info);
      //console.log(associations_info.implicit_associations);
    }
    associations_info.mutations_attributes = attributesToString(associations_info.mutations_attributes);
    return associations_info;
  }

generateAssociationsMigrations =  function( opts, dir_write){

    opts.associations.implicit_associations.belongsTo.forEach( async (assoc) =>{
      assoc["source"] = opts.table;
      assoc["cross"] = false;
      let generatedMigration = await module.exports.generateJs('create-association-migration',assoc);
      let name_migration = createNameMigration(dir_write, 'z-column-'+assoc.targetKey+'-to-'+opts.table);
      fs.writeFile( name_migration, generatedMigration, function(err){
        if (err)
        {
          return console.log(err);
        }else{
          console.log(name_migration+" writen succesfully!");
        }
      });
    });

    opts.associations.implicit_associations.belongsToMany.forEach( async (assoc) =>{
      assoc["source"] = opts.table;
      let generatedMigration = await module.exports.generateJs('create-through-migration',assoc);
      let name_migration = createNameMigration(dir_write, 'z-through-'+assoc.keysIn);
      fs.writeFile( name_migration, generatedMigration, function(err){
        if (err)
        {
          return console.log(err);
        }else{
          console.log(name_migration+" writen succesfully!");
        }
      });
    });
}

generateSection = async function(section, opts, dir_write )
{
  let generatedSection = await module.exports.generateJs('create-'+section ,opts);
  fs.writeFile(dir_write, generatedSection, function(err) {
    if (err)
    {
      return console.log(err);
    }
  });
}

createNameMigration = function(dir_write, model_name)
{
  let date = new Date();
   date = date.toISOString().slice(0,19).replace(/[^0-9]/g, "");
  //return dir_write + '/migrations/' + date + '-create-'+model_name +'.js';
  return dir_write + '/migrations/' + date + '-'+model_name +'.js';
}

writeCommons = function(dir_write){
  writeSchemaCommons(dir_write);
  writeIndexModelsCommons(dir_write);
}


module.exports.generateCode = function(json_dir, dir_write)
{
  console.log("Generating files...");
  dir_write = (dir_write===undefined) ? __dirname : dir_write;
  let sections = ['schemas', 'resolvers', 'models', 'migrations'];
  let models = [];
  let attributes_schema = {};
  let summary_associations = {'one-many': [], 'many-many': {}};

  // creates one folder for each of schemas, resolvers, models
  sections.forEach( (section) => {
    if(!fs.existsSync(dir_write+'/'+section))
    {
      fs.mkdirSync(dir_write+'/'+section);
    }
  });

  if(!fs.existsSync(dir_write+'/models-webservice'))
  {
    fs.mkdirSync(dir_write+'/models-webservice');
  }

  //test
  fs.readdirSync(json_dir).forEach((json_file) => {
      console.log("Reading...", json_file);
      let file_to_object = parseFile(json_dir+'/'+json_file);
      let opts = module.exports.getOptions(file_to_object);
      models.push([opts.name , opts.namePl]);
      console.log(opts.name);
      //console.log(opts.associations);

      if(opts.storageType === 'sql'){
        sections.forEach((section) =>{
            let file_name = "";
            if(section==='migrations')
            {
              file_name = createNameMigration(dir_write,opts.nameLc);
            }else{
              file_name = dir_write + '/'+ section +'/' + opts.nameLc + '.js';
            }

            generateSection(section, opts, file_name)
            .then( () => {
                console.log(file_name + ' written succesfully!');
            });
        });
        generateAssociationsMigrations(opts, dir_write);
      }else if(opts.storageType === 'webservice'){
          let file_name = "";
          file_name = dir_write + '/schemas/' + opts.nameLc + '.js';
          generateSection("schemas",opts,file_name).then( ()=>{
            console.log(file_name + ' written succesfully!(from webservice)');
          });


          file_name = dir_write + '/models-webservice/' + opts.nameLc + '.js';
          generateSection("models-webservice",opts,file_name).then( ()=>{
            console.log(file_name + ' written succesfully!(from webservice)');
          });


          file_name = dir_write + '/resolvers/' + opts.nameLc + '.js';
          generateSection("resolvers-webservice",opts,file_name).then( ()=>{
            console.log(file_name + ' written succesfully!(from webservice)');
          });

      }

  });

  let index_resolvers_file = dir_write + '/resolvers/index.js';
  generateSection('resolvers-index',{models: models} ,index_resolvers_file)
  .then( () => {
    console.log('resolvers-index written succesfully!');
  });

  writeCommons(dir_write);
}
