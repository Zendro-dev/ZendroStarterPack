const config = require('../config/data_models_storage_config.json');

// Map each key to a key:storageType string
const sqlKeys = Object
  .keys(config)
  .map(k => (`${k}:${config[k].storageType}`));

// Print mapped keys to stdout as a space-separated string
console.log( sqlKeys.join(' ') );