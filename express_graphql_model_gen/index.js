#!/usr/bin/env node

const program = require('commander');
var fs = require('fs');
const funks = require('./funks');

program
  .version('0.0.1')
  .description('Code generator for GraphQL server');

program
  .command('generate <json-files-folder> [dir_to_write]')
  .alias('g')
  .description('Generate code for each model described by each input json file in the \'json-files-folder\'')
  .action((json_dir, dir_write) => {
      //Generate full code : models, schemas, resolvers, migrations
      funks.generateCode(json_dir, dir_write);

  });

program.parse(process.argv);
