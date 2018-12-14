#!/usr/bin/env node

// Required packages:
ejs = require('ejs');
inflection = require('inflection');
fs = require('fs-extra');
path = require('path');
jsb = require('js-beautify').js_beautify;
funks = require(path.resolve(__dirname, 'funks.js'));
program = require('commander');

modelsCreated = require(path.resolve(__dirname, 'modelsNames.js'));


// Parse command-line-arguments and execute:
program
  .arguments('<directory>')
  .option('--jsonFiles <filesFolder>', 'Folder containing one json file for each model')
  .parse(process.argv);
// Do your job:
var directory = program.args[0]

console.log('\nRender GUI components for model in: ', directory);
let promises = []
fs.readdirSync(program.jsonFiles).forEach( async (json_file) =>{

  let fileData = funks.parseFile(program.jsonFiles + '/'+json_file );
  let ejbOpts = funks.fillOptionsForViews(fileData);
  console.log("Proccessing ", ejbOpts.name)
  let componentsDir = path.resolve(directory, "src", "components")
  // table
  let table = path.resolve(componentsDir, ejbOpts['namePl'] + '.vue')
  promises.push( funks.renderToFile(table, 'tableView', ejbOpts) )
  // custom actions
  let customActions = path.resolve(componentsDir, ejbOpts.name +
    'CustomActions.vue')
  promises.push( funks.renderToFile(customActions, 'customActions', ejbOpts))
  // details
  let details = path.resolve(componentsDir, ejbOpts.name + 'DetailRow.vue')
  promises.push( funks.renderToFile(details, 'detailView', ejbOpts))
  // form elements
  // console.log("belongsTosArr: " + JSON.stringify(ejbOpts.belongsTosArr));
  let formElmns = path.resolve(componentsDir, ejbOpts.name + 'FormElemns.vue')
  promises.push( funks.renderToFile(formElmns, 'formElements', ejbOpts))
  // create form
  let createForm = path.resolve(componentsDir, ejbOpts.name + 'CreateForm.vue')
  promises.push( funks.renderToFile(createForm, 'createForm', ejbOpts))
  // upload CSV / XLSX form
  let uploadCsvForm = path.resolve(componentsDir, ejbOpts.name + 'UploadCsvForm.vue')
  promises.push( funks.renderToFile(uploadCsvForm, 'uploadCsvForm', ejbOpts))
  // edit form
  let editForm = path.resolve(componentsDir, ejbOpts.name + 'EditForm.vue')
  promises.push( funks.renderToFile(editForm, 'editForm', ejbOpts))
  // routes
  let routesExt = path.resolve(directory, "src", "router", ejbOpts.name +
    "Routes.js")
  promises.push( funks.renderToFile(routesExt, 'routes', ejbOpts))
  //graphql request
  let grapqlRequestPath = path.resolve(directory, "src", "requests", ejbOpts.nameLc + ".js")
  promises.push( funks.renderToFile(grapqlRequestPath, "graphqlRequests", ejbOpts))
  // constants
  let constants = path.resolve(directory, "src", "sciencedb-globals.js")
  promises.push( funks.renderToFile(constants, 'global_constant', ejbOpts))
});

 Promise.all(promises).then( (values) =>{
   //Copy static (not to be rendered) code into target dir, if not already
   //present:
   let filtBarPath = path.resolve(directory, 'src', 'components', 'FilterBar.vue')
   funks.copyFileIfNotExists(path.resolve(__dirname, 'FilterBar.vue'), filtBarPath)
   let forKeyPath = path.resolve(directory, 'src', 'components',
     'foreignKeyFormElement.vue')
   funks.copyFileIfNotExists(path.resolve(__dirname, 'foreignKeyFormElement.vue'),
     forKeyPath)
   let hasManyPath = path.resolve(directory, 'src', 'components',
     'hasManyFormElemn.vue')
   funks.copyFileIfNotExists(path.resolve(__dirname, 'hasManyFormElemn.vue'),
     hasManyPath)
   let datePickerPath = path.resolve(directory, 'src', 'components',
     'datePicker.vue')
   funks.copyFileIfNotExists(path.resolve(__dirname, 'datePicker.vue'),
     datePickerPath)
   let addNewPath = path.resolve(directory, 'src', 'components', 'AddNewEntityButton.vue')
   funks.copyFileIfNotExists(path.resolve(__dirname, 'AddNewEntityButton.vue'), addNewPath)
   let scrollPath = path.resolve(directory, 'src', 'components', 'scrollListElement.vue')
   funks.copyFileIfNotExists(path.resolve(__dirname,'scrollListElement.vue'), scrollPath)

   //automatically injects models components into routes array (routes_index.js file)
   let modelsObj = modelsCreated.getSavedModelsNames("", directory);
   let indexRoutesExt = path.resolve(directory, "src", "router", "routes_index.js")
   funks.renderToFile(indexRoutesExt, 'routes_index', modelsObj)
   let sideNavPath = path.resolve(directory,"src","components","SideNav.vue")
   funks.renderToFile(sideNavPath, 'sideNav', modelsObj)
 })
 .catch((error)=>{console.log(error); console.log("SOMETHING WRONG")});


console.log("\nDONE\n");
