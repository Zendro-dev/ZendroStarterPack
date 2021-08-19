const { existsSync } = require("fs");
const { join } = require("path");
const { getModulesSync } = require("../../utils/module-helpers");

let adapters = {
  sql: {},
  mongodb: {},
  cassandra: {},
  amazonS3: {},
  trino: {},
  presto: {},
  neo4j: {},
};
module.exports = adapters;
getModulesSync(__dirname).forEach((file) => {
  let adapter = require(join(__dirname, file));

  if (adapters[adapter.adapterName]) {
    throw new Error(`Duplicated adapter name ${adapter.adapterName}`);
  }

  switch (adapter.adapterType) {
    case "ddm-adapter":
    case "zendro-webservice-adapter":
    case "generic-adapter":
      adapters[adapter.adapterName] = adapter;
      break;

    case "sql-adapter":
    case "mongodb-adapter":
    case "cassandra-adapter":
    case "trino-adapter":
    case "presto-adapter":
    case "neo4j-adapter":
      adapters[adapter.adapterType.split("-")[0]][adapter.adapterName] =
        adapter.definition;
      adapters[adapter.adapterName] = adapter;
      break;
    case "amazon-s3-adapter":
      adapters["amazonS3"][adapter.adapterName] = adapter.definition;
      adapters[adapter.adapterName] = adapter;
      break;
    case "default":
      throw new Error(`
        Adapter storageType '${adapter.storageType}' is not supported`);
  }

  let patches_patch = join(__dirname, "..", "..", "patches", file);

  if (existsSync(patches_patch)) {
    adapter = require(`${patches_patch}`).logic_patch(adapter);
  }
});
