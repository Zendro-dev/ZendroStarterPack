const XLSX = require("xlsx");
const Promise = require("bluebird");
const promise_csv_parse = Promise.promisify(require("csv-parse"));
const csv_parse = require("csv-parse");
const fs = require("fs");
const awaitifyStream = require("awaitify-stream");
const validatorUtil = require("./validatorUtil");
const admZip = require("adm-zip");

/**
 * replaceNullStringsWithLiteralNulls - Replace null entries of columns with literal null types
 *
 * @param  {array} arrOfObjs Each item correponds to a column represented as object.
 * @return {array}           Each item corresponds to a column and all items have either a valid entry or null type.
 */
replaceNullStringsWithLiteralNulls = function (arrOfObjs) {
  console.log(typeof arrOfObjs, arrOfObjs);
  return arrOfObjs.map(function (csvRow) {
    Object.keys(csvRow).forEach(function (csvCol) {
      csvCell = csvRow[csvCol];
      csvRow[csvCol] =
        csvCell === "null" || csvCell === "NULL" ? null : csvCell;
    });
    return csvRow;
  });
};

/**
 * parseCsv - parse csv file (string)
 *
 * @param  {string} csvStr Csv file converted to string.
 * @param {string} delim Set the field delimiter in the csv file. One or multiple character.
 * @param {array|boolean|function} cols Columns as in csv-parser options.(true if auto-discovered in the first CSV line).
 * @return {array}        Each item correponds to a column represented as object and filtered with replaceNullStringsWithLiteralNulls function.
 */
exports.parseCsv = function (csvStr, delim, cols) {
  if (!delim) delim = ",";
  if (typeof cols === "undefined") cols = true;
  return replaceNullStringsWithLiteralNulls(
    promise_csv_parse(csvStr, {
      delimiter: delim,
      columns: cols,
    })
  );
};

/**
 * parseXlsx - description
 *
 * @param  {string} bstr Xlsx file converted to string
 * @return {array}      Each item correponds to a column represented as object and filtered with replaceNullStringsWithLiteralNulls function.
 */
exports.parseXlsx = function (bstr) {
  var workbook = XLSX.read(bstr, {
    type: "binary",
  });
  var sheet_name_list = workbook.SheetNames;
  return replaceNullStringsWithLiteralNulls(
    XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
  );
};

/**
 * Function that will delete a file if it exists and is insensitive to the
 * case when a file not exist.
 *
 * @param {String} path - A path to the file
 */
exports.deleteIfExists = function (path) {
  console.log(`Removing ${path}`);
  fs.unlink(path, function (err) {
    // file may be already deleted
  });
};

/**
 * Function deletes properties that contain string values "NULL" or "null".
 *
 * @param {Object} pojo - A plain old JavaScript object.
 *
 * @return {Object} A modified clone of the argument pojo in which all String
 * "NULL" or "null" values are deleted.
 */
exports.replacePojoNullValueWithLiteralNull = function (pojo) {
  if (pojo === null || pojo === undefined) {
    return null;
  }
  let res = Object.assign({}, pojo);
  Object.keys(res).forEach((k) => {
    if (typeof res[k] === "string" && res[k].match(/\s*null\s*/i)) {
      delete res[k];
    }
  });
  return res;
};

/**
 * castCsv - Cast values from csv file when converting to object.
 *            Method used in the cast opition for csv-pars, more info: https://csv.js.org/parse/options/cast/
 *
 * @param  {String} value           The raw value from the csv file
 * @param  {String} column          The name of the column to which the value belongs
 * @param  {Object} attributes_type Key is the name of the attribute/column as given in the json file of the model, value is the type of the attribute.
 * @return {any}                 The value casted according to the attribute type given in attributes_type.
 */
castCsv = function (value, column, attributes_type, array_delimiter = ";") {
  if (!(typeof value === "string" && value.match(/\s*null\s*/i))) {
    switch (attributes_type[column]) {
      case "String":
        value = String(value);
        break;
      case "Int":
        value = Number(value);
        break;
      case "Date":
        value = String(value);
        break;
      case "Time":
        value = String(value);
        break;
      case "DateTime":
        value = String(value);
        break;
      case "Boolean":
        if (value === "true") value = true;
        if (value === "false") value = false;
        break;
      case "Float":
        value = Number(value);
        break;
      case "[String]":
        value = value.split(array_delimiter);
        break;
      case "[Int]":
        value = value.split(array_delimiter).map((x) => parseInt(x));
        break;
      case "[Date]":
        value = value.split(array_delimiter);
        break;
      case "[Time]":
        value = value.split(array_delimiter);
        break;
      case "[DateTime]":
        value = value.split(array_delimiter);
        break;
      case "[Boolean]":
        value.split(array_delimiter).map((x) => x === "true");
        break;
      case "[Float]":
        value = value.split(array_delimiter).map((x) => parseFloat(x));
        break;

      default:
        value = String(value);
        break;
    }
  }
  return value;
};

/**
 * Parse by streaming a csv file and create the records in the correspondant table
 * @function
 * @param {string} csvFilePath - The path where the csv file is stored.
 * @param {object} model - Sequelize model, record will be created through this model.
 * @param {string} delim - Set the field delimiter in the csv file. One or multiple character.
 * @param {array|boolean|function} cols - Columns as in csv-parser options.(true if auto-discovered in the first CSV line).
 * @param {string} storageType - Set the storage type(default: "sql").
 */
exports.parseCsvStream = async function (
  csvFilePath,
  model,
  delim,
  cols,
  storageType = "sql",
  arrayDelim = ";"
) {
  if (!delim) delim = ",";
  if (typeof cols === "undefined") cols = true;
  console.log("TYPEOF", typeof model);
  // Wrap all database actions within a transaction for sequelize:
  let transaction;
  // define mongoDb collection
  let collection;
  if (storageType === "sql") {
    transaction = await model.sequelize.transaction();
  } else if (storageType === "mongodb") {
    const db = await model.storageHandler;
    collection = await db.collection("animal");
  }

  let addedFilePath =
    csvFilePath.substr(0, csvFilePath.lastIndexOf(".")) + ".json";
  let addedZipFilePath =
    csvFilePath.substr(0, csvFilePath.lastIndexOf(".")) + ".zip";

  console.log(addedFilePath);
  console.log(addedZipFilePath);

  try {
    // Pipe a file read-stream through a CSV-Reader and handle records asynchronously:
    let csvStream = awaitifyStream.createReader(
      fs.createReadStream(csvFilePath).pipe(
        csv_parse({
          delimiter: delim,
          columns: cols,
          cast: function (value, context) {
            return castCsv(
              value,
              context.column,
              model.definition.attributes,
              arrayDelim
            );
          },
        })
      )
    );

    // Create an output file stream
    let addedRecords = awaitifyStream.createWriter(
      fs.createWriteStream(addedFilePath)
    );

    let record;
    let errors = [];

    while (null !== (record = await csvStream.readAsync())) {
      record = exports.replacePojoNullValueWithLiteralNull(record);
      try {
        await validatorUtil.validateData("validateForCreate", model, record);
        if (storageType === "sql") {
          record = model.preWriteCast(record);
          await model
            .create(record, {
              transaction: transaction,
            })
            .then((created) => {
              // this is async, here we just push new line into the parallel thread
              // synchronization goes at endAsync;
              addedRecords.writeAsync(`${JSON.stringify(created)}\n`);
            })
            .catch((error) => {
              console.log(
                `Caught sequelize error during CSV batch upload: ${JSON.stringify(
                  error
                )}`
              );
              error.record = record;
              errors.push(error);
            });
        } else if (storageType === "mongodb") {
          try {
            const response = await collection.insertOne(record);
            addedRecords.writeAsync(`${JSON.stringify(response.ops[0])}\n`);
          } catch (error) {
            console.log(
              `Caught MongoDb error during CSV batch upload: ${JSON.stringify(
                error
              )}`
            );
            error.record = record;
            errors.push(error);
          }
        }
      } catch (error) {
        console.log(
          `Validation error during CSV batch upload: ${JSON.stringify(error)}`
        );
        error["record"] = record;
        errors.push(error);
      }
    }

    // close the addedRecords file so it can be sent afterwards
    await addedRecords.endAsync();

    if (errors.length > 0) {
      let message =
        "Some records could not be submitted. No database changes has been applied.\n";
      message += "Please see the next list for details:\n";

      errors.forEach(function (error) {
        valErrMessages = error.errors.reduce((acc, val) => {
          return acc
            .concat(val.dataPath)
            .concat(" ")
            .concat(val.message)
            .concat(" ");
        });
        message += `record ${JSON.stringify(error.record)} ${
          error.message
        }: ${valErrMessages}; \n`;
      });

      throw new Error(message.slice(0, message.length - 1));
    }

    if (storageType === "sql") {
      await transaction.commit();
    }

    // zip comitted data and return a corresponding file path
    let zipper = new admZip();
    zipper.addLocalFile(addedFilePath);
    await zipper.writeZip(addedZipFilePath);

    console.log(addedZipFilePath);

    // At this moment the parseCsvStream caller is responsible in deleting the
    // addedZipFilePath
    return addedZipFilePath;
  } catch (error) {
    await transaction.rollback();

    exports.deleteIfExists(addedFilePath);
    exports.deleteIfExists(addedZipFilePath);

    throw error;
  } finally {
    exports.deleteIfExists(addedFilePath);
  }
};
