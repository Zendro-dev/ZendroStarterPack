var unique = require('array-unique');
var exports = module.exports = {};
var fs = require('fs-extra');
var inflection = require('inflection')
const {promisify} = require('util');
const ejsRenderFile = promisify( ejs.renderFile )

// Render EJB template
exports.renderTemplate = async function(templateName, options) {
  try {
    return await ejsRenderFile(__dirname + '/views/pages/' + templateName +
      '.ejs', options, {})
  } catch (err) {
    console.log(`ERROR rendering template ${templateName}:\n${err}`);
  }
}

// Write rendered string into file
exports.renderToFile = async function(outFile, templateName, options) {
  // console.log("options:\n" + JSON.stringify(options) + "\n");
  let fileCont = await exports.renderTemplate(templateName, options)
  p = new Promise((resolve, reject) =>{

    fs.writeFile(outFile, fileCont,
      function(err) {
        if (err) {
          console.log(err)
          reject(err);
          //return err
        } else {
          console.log("Wrote rendered content into '%s'.", outFile)
          resolve();
        }
      })
  });

  return p;
}

// Parse input 'attributes' argument into array of arrays:
// [ [ 'name':'string' ], [ 'is_human':'boolean' ] ]
exports.attributesArray = function(attributesStr) {
  if (attributesStr !== undefined && attributesStr !== null && typeof attributesStr ===
    'string') {
    return attributesStr.trim().split(/[\s,]+/).map(function(x) {
      return x.trim().split(':')
    });
  } else {
    return []
  }
}

// Collect attributes into a map with keys the attributes' types and values the
// attributes' names: { 'string': [ 'name', 'last_name' ], 'boolean': [
// 'is_human' ] }
exports.typeAttributes = function(attributesArray) {
  y = {};
  attributesArray.forEach(function(x) {
    if (!y[x[1]]) y[x[1]] = [x[0]]
    else y[x[1]] = y[x[1]].concat([x[0]])
  })
  return y;
}

exports.associationsArray = function(associationsStr) {
  if (typeof associationsStr === 'undefined') {
    return []
  }
  return associationsStr.trim().split(/\s+|,/).filter(function(x) {
    return x !== ''
  }).map(function(x) {
    return x.trim().split(/:/)
  })
}

// parses the CLI argument --belongsTos and returns the values as an array of
// BelongTo Objects:
exports.parseBelongsTos = function(belongsTosStr) {
  return exports.associationsArray(belongsTosStr).map(function(bt) {
    return {
      targetModel: bt[0],
      foreignKey: bt[1],
      primaryKey: bt[2],
      label: bt[3],
      subLabel: bt[4],
      targetModelLc: bt[0].toLowerCase(),
      targetModelPlLc: inflection.pluralize(bt[0]).toLowerCase(),
      relationName: bt[5] || bt[0]
    }
  })
}

// parses the CLI argument --hasManys and returns the values as an array of
// relations Objects:
exports.parseHasManys = function(hasManysStr) {
  return exports.associationsArray(hasManysStr).map(function(rel) {
    return {
      relationName: rel[0],
      targetModelPlLc: inflection.pluralize(rel[1]).toLowerCase(),
      label: rel[2],
      subLabel: rel[3],
    }
  })
}

// Copies file found under sourcePath to targetPath if and only if target does
// not exist:
exports.copyFileIfNotExists = async function(sourcePath, targetPath) {

    fs.stat(targetPath, function(err, stat) {
      if (err != null) {
        fs.copySync(sourcePath, targetPath);
      }
    });
}

exports.parseFile = function(jFile){
  let data=fs.readFileSync(jFile, 'utf8');
  let words=JSON.parse(data);
  return words;
}

exports.fillOptionsForViews = function(fileData){
  //fileData = parseFile(jFile);
  let associations = parseAssociationsFromFile(fileData.associations);
  let opts = {
    baseUrl: fileData.baseUrl,
    //check compatibility with name in express_graphql_gen
    name: fileData.model,
    nameLc: fileData.model.toLowerCase(),
    namePl: inflection.pluralize(fileData.model.toLowerCase()),
    namePlLc: inflection.pluralize(fileData.model.toLowerCase()).toLowerCase(),
    nameCp: inflection.capitalize(fileData.model),
    attributesArr: attributesArrayFromFile(fileData.attributes),
    typeAttributes: exports.typeAttributes(attributesArrayFromFile(fileData.attributes)),
    belongsTosArr: associations.belongsTos,
    hasManysArr: associations.hasManys
  }

  return opts;
}

attributesArrayFromFile = function(attributes){
  let attArray = []

  for(attr in attributes){
    attArray.push([ attr, attributes[attr] ]);
  }

  return attArray;
}

parseAssociationsFromFile = function(associations){
  let assoc = {
    "belongsTos" : [],
    "hasManys" : []
  }

  if(associations!==undefined){

    Object.entries(associations).forEach( ([name, association]) =>{
      let type = association.type.split("_")[1];

      if(type === "belongsTo"){
        let bt = {
          "targetModel": association.target.toLowerCase(),
          "foreignKey": association.targetKey,
          "primaryKey" : "id",
          "label" : association.label,
          //sublabel can be undefined
          "sublabel" : association.sublabel,
          "targetModelLc" : association.target.toLowerCase(),
          "targetModelPlLc" : inflection.pluralize(association.target).toLowerCase(),
          "targetModelCp" : inflection.capitalize(association.target),
          "targetModelPlCp": inflection.capitalize(inflection.pluralize(association.target)),
          "relationName" : name
        }

        assoc.belongsTos.push(bt);
      }else if(type==="hasMany" || type==="belongsToMany"){
        let hm = {
          "relationName" : name,
          "targetModelPlLc" : inflection.pluralize(association.target).toLowerCase(),
          "targetModelCp" : inflection.capitalize(association.target),
          "targetModelPlCp": inflection.capitalize(inflection.pluralize(association.target)),
          "label" : association.label,
          //sublabel can be undefined
          "sublabel" : association.sublabel
        }

        assoc.hasManys.push(hm);
      }else{
        //association hasOne??
        console.log("Association type"+ association.type + "not supported.");
      }
    });
  }
  return assoc;
}
