const { Sequelize } = require("sequelize");
const storageConfig = require("./config/data_models_storage_config.json");
const { MongoClient } = require("mongodb");
const AWS = require("aws-sdk");
const presto = require("presto-client");
const cassandraDriver = require("cassandra-driver");
const neo4j = require("neo4j-driver");
const { queryData } = require("./utils/presto_helper");
const os = require("os");
const Op = Sequelize.Op;
storageConfig.operatorsAliases = {
  $eq: Op.eq,
  $and: Op.and,
  $or: Op.or,
  $like: Op.like,
  $notLike: Op.notLike,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $in: Op.in,
  $notIn: Op.notIn,
  $gt: Op.gt,
  $gte: Op.gte,
  $lt: Op.lt,
  $lte: Op.lte,
  $ne: Op.ne,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
};

/**
 * setup the cassandraClient
 */
function setupCassandraDriver() {
  let cassandraConfig = storageConfig["default-cassandra"];
  // set up logging of requests
  let requestTracker = new cassandraDriver.tracker.RequestLogger({
    slowThreshold: 1000,
    logNormalRequests: true,
    logErroredRequests: true,
  });
  requestTracker.emitter.on("normal", (message) => console.log(message));
  requestTracker.emitter.on("slow", (message) => console.log(message));
  requestTracker.emitter.on("failure", (message) => console.log(message));
  requestTracker.emitter.on("large", (message) => console.log(message));
  // set up new cassandra client as configurated in 'default-cassandra'
  return new cassandraDriver.Client({
    contactPoints: [cassandraConfig.host],
    localDataCenter: "datacenter1",
    keyspace: cassandraConfig.keyspace,
    protocolOptions: {
      port: cassandraConfig.port,
    },
    requestTracker: requestTracker,
  });
}

// const cassandraClient = setupCassandraDriver();

/**
 * setup the MongoClient
 */
async function setupMongoDriver() {
  let config = storageConfig["default-mongodb"];
  const uri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
  console.log(uri);
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const db = await connectMongoDb(client);
  return db;
}

async function connectMongoDb(client) {
  try {
    await client.connect();
    let config = storageConfig["default-mongodb"];
    console.log(`Connecting to MongoDB: ${config.database}`);
    const db = await client.db(config.database);
    console.log(`Connected successfully to MongoDB: ${config.database}`);
    return db;
  } catch (e) {
    console.log("MongoDB connection error: " + e);
  }
}

const setupAmazonS3 = async () => {
  let config = storageConfig["default-amazonS3"];
  const s3 = new AWS.S3({
    accessKeyId: config.username,
    secretAccessKey: config.password,
    endpoint: `http://${config.host}:${config.port}`,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
  });

  let res = await s3.listBuckets().promise();
  let buckets = res.Buckets.map((bucketObj) => bucketObj.Name);
  if (buckets.includes(config.bucket)) {
    console.log(`bucket ${config.bucket} in Minio exists`);
  } else {
    console.log(`create a new bucket in Minio: ${config.bucket}`);
    res = await s3.createBucket({ Bucket: config.bucket }).promise();
  }

  return s3;
};

/**
 * Stored connection instances.
 */
const addConnectionInstances = async () => {
  let connectionInstances = new Map();
  const user = os.userInfo().username;
  for (let key of Object.keys(storageConfig)) {
    let storageType = storageConfig[key].storageType;
    if (
      storageConfig.hasOwnProperty(key) &&
      key !== "operatorsAliases" &&
      storageType === "sql"
    ) {
      connectionInstances.set(key, {
        storageType,
        connection: new Sequelize(storageConfig[key]),
      });
    } else if (
      storageConfig.hasOwnProperty(key) &&
      key !== "operatorsAliases" &&
      storageType === "mongodb"
    ) {
      connectionInstances.set(key, {
        storageType,
        connection: await setupMongoDriver(),
      });
    } else if (
      storageConfig.hasOwnProperty(key) &&
      key !== "operatorsAliases" &&
      storageType === "cassandra"
    ) {
      connectionInstances.set(key, {
        storageType,
        connection: setupCassandraDriver(),
      });
    } else if (
      storageConfig.hasOwnProperty(key) &&
      key !== "operatorsAliases" &&
      storageType === "amazon-s3"
    ) {
      connectionInstances.set(key, {
        storageType,
        connection: await setupAmazonS3(),
      });
    } else if (
      storageConfig.hasOwnProperty(key) &&
      key !== "operatorsAliases" &&
      storageType === "trino"
    ) {
      connectionInstances.set(key, {
        storageType,
        connection: new presto.Client({
          user: `"${user}"`,
          host: storageConfig[key].trino_host,
          port: storageConfig[key].trino_port,
          catalog: storageConfig[key].catalog,
          schema: storageConfig[key].schema,
          source: "nodejs-client",
          engine: "trino",
        }),
      });
    } else if (
      storageConfig.hasOwnProperty(key) &&
      key !== "operatorsAliases" &&
      storageType === "presto"
    ) {
      connectionInstances.set(key, {
        storageType,
        connection: new presto.Client({
          user: `"${user}"`,
          host: storageConfig[key].presto_host,
          port: storageConfig[key].presto_port,
          catalog: storageConfig[key].catalog,
          schema: storageConfig[key].schema,
          source: "nodejs-client",
          engine: "presto",
        }),
      });
    } else if (
      storageConfig.hasOwnProperty(key) &&
      key !== "operatorsAliases" &&
      storageType === "neo4j"
    ) {
      // note: https://stackoverflow.com/a/62816512/8132085
      connectionInstances.set(key, {
        storageType,
        connection: neo4j.driver(
          `bolt://${storageConfig[key].host}:${storageConfig[key].port}`,
          neo4j.auth.basic(
            storageConfig[key].username,
            storageConfig[key].password
          ),
          { disableLosslessIntegers: true }
        ),
      });
    }
  }
  return connectionInstances;
};

/**
 * Async verification of all connections imported from
 * data_models_storage_config.json.
 */
exports.checkConnections = async () => {
  const checks = [];
  const connectionInstances = await addConnectionInstances();
  // console.log(connectionInstances)

  for (let { 0: key, 1: instance } of connectionInstances.entries()) {
    try {
      if (instance.storageType === "sql") {
        await instance.connection.authenticate();
      } else if (instance.storageType === "mongodb") {
        await instance.connection.command({ ping: 1 });
      } else if (instance.storageType === "cassandra") {
        await instance.connection.connect();
      } else if (instance.storageType === "amazon-s3") {
        await instance.connection
          .waitFor("bucketExists", {
            Bucket: storageConfig["default-amazonS3"].bucket,
          })
          .promise();
      } else if (instance.storageType === "trino") {
        try {
          const trino_conf = storageConfig["default-trino"];
          await queryData(
            `SHOW TABLES FROM ${trino_conf.catalog}.${trino_conf.schema}`,
            instance.connection
          );
        } catch (error) {
          throw error;
        }
      } else if (instance.storageType === "presto") {
        try {
          const presto_conf = storageConfig["default-presto"];
          await queryData(
            `SHOW TABLES FROM ${presto_conf.catalog}.${presto_conf.schema}`,
            instance.connection
          );
        } catch (error) {
          throw error;
        }
      } else if (instance.storageType === "neo4j") {
        await instance.connection.verifyConnectivity({
          database: storageConfig["default-neo4j"].database,
        });
      }
      checks.push({ key, valid: true });
    } catch (exception) {
      checks.push({ key, valid: false });
    }
  }

  return checks;
};

/**
 * Get an existing sequelize instance using the specified database.
 * @param {string} key connection key as defined in the model config
 * @returns A configured connection instance
 */
exports.getConnectionInstances = async () => {
  const connectionInstances = await addConnectionInstances();

  return connectionInstances;
};

exports.ConnectionError = class ConnectionError extends Error {
  /**
   * Create a new instance of a data model connection error.
   * @param {object} modelDefinition model definition as a JSON object
   */
  constructor({ database, model, storageType }) {
    const message =
      `Model "${model}" connection to its database failed. Verify that ` +
      `database "${database}" and storageType "${storageType}" are ` +
      `correctly set and match the config in "data_models_storage_config.json"`;
    super(message);
  }
};

/**
 * Add connection as a static property of the data model class.
 * @param {object} modelClass the data model class
 * @param {object} connection the connection
 * @returns The data model class with connection as a static property.
 */
exports.getAndConnectDataModelClass = (modelClass, connection) => {
  return Object.defineProperty(modelClass, "storageHandler", {
    value: connection,
    writable: false, // cannot be changed in the future
    enumerable: true,
    configurable: false,
  });
};
