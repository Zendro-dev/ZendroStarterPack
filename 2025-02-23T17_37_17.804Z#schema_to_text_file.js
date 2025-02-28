"use strict";
const fs = require("fs");
const path = require("path");
const helper = require("../utils/helper");
const { printSchema } = require("graphql");

/**
 * @module - Migration to generate and save GraphQL schema
 */
module.exports = {
  /**
   * up - Generate and save GraphQL schema to a file
   *
   * @param  {object} zendro initialized zendro object
   */
  up: async (zendro) => {
    try {

      let Schema = helper.mergeSchemaSetScalarTypes(
        path.join(__dirname, "../schemas")
      );

      if (!Schema) {
        throw new Error("Schema is empty or undefined.");
      }
      const schemaString = printSchema(Schema);
      const outputPath = path.join(__dirname, "../schema.graphql");

      fs.writeFileSync(outputPath, schemaString, "utf8");
      console.log(`GraphQL Schema saved to ${outputPath}`);
    } catch (error) {
      throw new Error(`Failed to generate GraphQL schema: ${error.message}`);
    }
  },

  /**
   * down - Remove the generated GraphQL schema file
   *
   * @param  {object} zendro initialized zendro object
   */
  down: async (zendro) => {
    try {
      const outputPath = path.join(__dirname, "../schema.graphql");
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log(`GraphQL Schema file ${outputPath} deleted successfully.`);
      } else {
        console.log(`GraphQL Schema file ${outputPath} does not exist.`);
      }
    } catch (error) {
      throw new Error(`Failed to remove GraphQL schema: ${error.message}`);
    }
  },
};
