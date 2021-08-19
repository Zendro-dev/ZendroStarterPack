#!/usr/bin/env node

const { checkConnections } = require('../connection');


/**
 * Async verification of all database connections defined in
 * data_models_storage_config.json
 */
async function runCheck () {

  /**
   * Reducer function to check whether any connection failed.
   * @param {boolean} acc reduced value from previous iterations
   * @param {object}  kvp key: connection, valid: ahle to connect
   */
  const checkDbConnectionReducer = (acc, { key, valid }) => {

    if (!valid) console.error(
      `Could not connect to database "${key}"`
    );

    return acc || !valid;
  }

  const anyFailed = (await checkConnections()).reduce(
    checkDbConnectionReducer, false
  );

  if (anyFailed) process.exit(1);

  process.exit(0);
}

runCheck();
