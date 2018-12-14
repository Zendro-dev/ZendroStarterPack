const expect = require('chai').expect;
var fs = require('fs');
const test = require('./data-test');
const models = require('./data-models');
const funks = require('../funks');

describe('Lower-case models', function(){

  it('GraphQL Schema - transcript_count', async function(){
    let opts = funks.getOptions(models.transcript_count);
    let generated_schema =await funks.generateJs('create-schemas', opts);
    let g_schema = generated_schema.replace(/\s/g, '');
    let test_schema = test.transcript_countSchema.replace(/\s/g, '');
    expect(g_schema).to.be.equal(test_schema);
  });

  it('Resolver - individual', async function(){
    let opts = funks.getOptions(models.individual);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.individualResolvers.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });

  it('Sequelize Model - individual', async function(){
    let opts = funks.getOptions(models.individual);
    let generated_model =await funks.generateJs('create-models', opts);
    let g_model = generated_model.replace(/\s/g, '');
    let test_model = test.individualModel.replace(/\s/g, '');
    expect(g_model).to.be.equal(test_model);
  });

});

describe('Empty associations', function(){

  it('GraphQL Schema - transcript_count (no assoc)', async function(){
    let opts = funks.getOptions(models.transcript_count_no_assoc);
    let generated_schema =await funks.generateJs('create-schemas', opts);
    let g_schema = generated_schema.replace(/\s/g, '');
    let test_schema = test.transcript_count_no_assoc_schema.replace(/\s/g, '');
    expect(g_schema).to.be.equal(test_schema);
  });

  it('Resolvers - individual (no assoc)', async function(){
    let opts = funks.getOptions(models.individual_no_assoc);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.individual_no_assoc_resolvers.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });

  it('Sequelize Model - transcript_count (no assoc)', async function(){
    let opts = funks.getOptions(models.transcript_count_no_assoc);
    let generated_model =await funks.generateJs('create-models', opts);
    let g_model = generated_model.replace(/\s/g, '');
    let test_model = test.transcript_count_no_assoc_model.replace(/\s/g, '');
    expect(g_model).to.be.equal(test_model);
  });


});

describe('Superfluous comma', function(){

  it('Sequelize Model - individual (no assoc)', async function(){
    let opts = funks.getOptions(models.individual_no_assoc);
    let generated_model =await funks.generateJs('create-models', opts);
    let g_model = generated_model.replace(/\s/g, '');
    let test_model = test.individual_no_assoc_model.replace(/\s/g, '');
    expect(g_model).to.be.equal(test_model);
  });

  it('Migration - transcript_count (no assoc)', async function(){
    let opts = funks.getOptions(models.transcript_count_no_assoc);
    let generated_migration =await funks.generateJs('create-migrations', opts);
    let g_migration = generated_migration.replace(/\s/g, '');
    let test_migration = test.transcript_count_no_assoc_migration.replace(/\s/g, '');
    expect(g_migration).to.be.equal(test_migration);
  });
});

describe('No include associations by default', function(){
  it('Resolvers - transcript_count', async function(){
    let opts = funks.getOptions(models.transcript_count);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.transcript_count_resolvers.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });

  it('Resolvers - person', async function(){
    let opts = funks.getOptions(models.person);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.person_resolvers.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });

});

describe('Limit for resolvers', function(){
  it('Resolvers - book', async function(){
    let opts = funks.getOptions(models.book);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.book_resolver_limit.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });
});

describe('Better name for search argument', function(){

  it('GraphQL Schema - researcher', async function(){
    let opts = funks.getOptions(models.researcher);
    let generated_schema =await funks.generateJs('create-schemas', opts);
    let g_schema = generated_schema.replace(/\s/g, '');
    let test_schema = test.researcher_schema.replace(/\s/g, '');
    expect(g_schema).to.be.equal(test_schema);
  });

  it('Resolvers - researcher', async function(){
    let opts = funks.getOptions(models.researcher);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.researcher_resolver.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });
});

describe('Count for model', function(){

  it('GraphQL Schema - individual', async function(){
    let opts = funks.getOptions(models.individual);
    let generated_schema =await funks.generateJs('create-schemas', opts);
    let g_schema = generated_schema.replace(/\s/g, '');
    let test_schema = test.individual_schema.replace(/\s/g, '');
    expect(g_schema).to.be.equal(test_schema);
  });

  it('Resolvers - individual', async function(){
    let opts = funks.getOptions(models.individual);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.individualResolvers.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });

  it('Resolvers - specie', async function(){
    let opts = funks.getOptions(models.specie);
    let generated_resolvers =await funks.generateJs('create-resolvers-webservice', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.specie_resolvers.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });
});


describe('VueTable', function(){

  it('GraphQL Schema - book', async function(){
    let opts = funks.getOptions(models.book);
    let generated_schema =await funks.generateJs('create-schemas', opts);
    let g_schema = generated_schema.replace(/\s/g, '');
    let test_schema = test.book_schema.replace(/\s/g, '');
    expect(g_schema).to.be.equal(test_schema);
  });

  it('Resolvers - book', async function(){
    let opts = funks.getOptions(models.book);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.book_resolver_table.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });
});

describe('Add instances query with associated records', function(){

  it('GraphQL Schema - person', async function(){
    let opts = funks.getOptions(models.person);
    let generated_schema =await funks.generateJs('create-schemas', opts);
    let g_schema = generated_schema.replace(/\s/g, '');
    let test_schema = test.person_schema.replace(/\s/g, '');
    expect(g_schema).to.be.equal(test_schema);
  });

  it('Resolvers - person', async function(){
    let opts = funks.getOptions(models.person);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.person_resolvers.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });
});

describe('Stream upload file', function(){

  it('Resolver - dog', async function(){
    let opts = funks.getOptions(models.dog);
    let generated_resolvers =await funks.generateJs('create-resolvers', opts);
    let g_resolvers = generated_resolvers.replace(/\s/g, '');
    let test_resolvers = test.dog_resolvers.replace(/\s/g, '');
    expect(g_resolvers).to.be.equal(test_resolvers);
  });

});

// if(!fs.existsSync(__dirname+'/test-data-output') ){
//   fs.mkdirSync(__dirname+'/test-data-output');
//   //Generate code
//   funks.generateCode(__dirname + '/test-data-json',__dirname + '/test-data-output' );
//
//
//   //Test for each case with generated code
//   describe('GrpahQL Schemas', function(){
//     it('GraphQL Local Storage Schema', function(){
//       fs.readFile(__dirname + '/test-data-output/schemas/project.js', 'utf8', (err, data) =>{
//         let test_graphql =  test.local_graphql_project.replace(/\s/g, '');
//         let created_graphql = data.replace(/\s/g, '');
//         expect(created_graphql).to.be.equal(test_graphql);
//       });
//     });
//
//     it('GraphQL Webservice Schema', function(){
//       fs.readFile(__dirname + '/test-data-output/schemas/specie.js', 'utf8', (err, data) =>{
//         let test_graphql = test.webservice_graphql_specie.replace(/\s/g, '');
//         let created_graphql = data.replace(/\s/g, '');
//         expect(created_graphql).to.be.equal(test_graphql);
//       });
//     });
//
//   });
//
//
//   describe('Resolvers', function(){
//     it('Local Storage Resolver', function(){
//       fs.readFile(__dirname + '/test-data-output/resolvers/project.js', 'utf8', (err, data) =>{
//         let test_resolver =  test.local_resolver_project.replace(/\s/g, '');
//         let created_resolver = data.replace(/\s/g, '');
//         expect(created_resolver).to.be.equal(test_resolver);
//       });
//     });
//
//     it('Webservice Resolver', function(){
//       fs.readFile(__dirname + '/test-data-output/resolvers/specie.js', 'utf8', (err, data) =>{
//         let test_resolver = test.webservice_resolver_specie.replace(/\s/g, '');
//         let created_resolver = data.replace(/\s/g, '');
//         expect(created_resolver).to.be.equal(test_resolver);
//       });
//     });
//
//   });
//
//   describe('Models', function(){
//     it('Local Storage Model', function(){
//       fs.readFile(__dirname + '/test-data-output/models/researcher.js', 'utf8', (err, data) =>{
//         let test_model =  test.local_model_researcher.replace(/\s/g, '');
//         let created_model = data.replace(/\s/g, '');
//         expect(created_model).to.be.equal(test_model);
//       });
//     });
//
//     it('Webservice Model', function(){
//       fs.readFile(__dirname + '/test-data-output/models-webservice/specie.js', 'utf8', (err, data) =>{
//         let test_model = test.webservice_model_specie.replace(/\s/g, '');
//         let created_model = data.replace(/\s/g, '');
//         expect(created_model).to.be.equal(test_model);
//       });
//     });
//
//   });
//
//
//   describe('Migrations', function(){
//     it('Local Migration', function(){
//
//       fs.readdirSync(__dirname + '/test-data-output/migrations')
//       .filter(function(file){
//         return (file.slice(-14)==='-researcher.js');
//       }).forEach(function(file){
//         console.log("Files: ",file);
//         fs.readFile(__dirname + '/test-data-output/migrations/'+file, 'utf8', (err, data) =>{
//           let test_migration =  test.local_migration_researcher.replace(/\s/g, '');
//           let created_migration = data.replace(/\s/g, '');
//           expect(created_migration).to.be.equal(test_migration);
//         });
//       })
//
//
//     });
//
//     it('Through Migration', function(){
//
//       fs.readdirSync(__dirname + '/test-data-output/migrations')
//       .filter(function(file){
//         return (file.slice(-14)==='_researcher.js');
//       }).forEach(function(file){
//         console.log("Files: ",file);
//         fs.readFile(__dirname + '/test-data-output/migrations/'+file, 'utf8', (err, data) =>{
//           let test_migration =  test.through_migration.replace(/\s/g, '');
//           let created_migration = data.replace(/\s/g, '');
//           expect(created_migration).to.be.equal(test_migration);
//         });
//       })
//
//
//     });
//
//   });
// }else{
//   console.log("Test already performed, for new testing please delete directory: " + __dirname+'/test-data-output');
// }
