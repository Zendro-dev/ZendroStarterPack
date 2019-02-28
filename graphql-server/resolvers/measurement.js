/*
    Resolvers for basic CRUD operations
*/

const measurement = require('../models/index').measurement;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
const helper = require('../utils/helper');
const globals = require('../config/globals');
const checkAuthorization = require('../utils/check-authorization');
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuidv4')
const resolvers = require('./index');
const {
    handleError
} = require('../utils/errors');

/**
 * measurement.prototype.field_plot - Return associated record
 *
 * @param  {string} _       First parameter is not used
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
measurement.prototype.field_plot = function(_, context) {
    return resolvers.readOneField_plot({
        "id": this.field_plot_id
    }, context);
}







module.exports = {

    /**
     * measurements - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    measurements: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'measurements', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return measurement.count(options).then(items => {
                    if (order !== undefined) {
                        options['order'] = order.map((orderItem) => {
                            return [orderItem.field, orderItem.order];
                        });
                    } else if (pagination !== undefined) {
                        options['order'] = [
                            ["id", "ASC"]
                        ];
                    }

                    if (pagination !== undefined) {
                        options['offset'] = pagination.offset === undefined ? 0 : pagination.offset;
                        options['limit'] = pagination.limit === undefined ? (items - options['offset']) : pagination.limit;
                    } else {
                        options['offset'] = 0;
                        options['limit'] = items;
                    }

                    if (globals.LIMIT_RECORDS < options['limit']) {
                        throw new Error(`Request of total measurements exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                    }
                    return measurement.findAll(options);
                });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * readOneMeasurement - Check user authorization and return one book with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneMeasurement: function({
        id
    }, context) {
        return checkAuthorization(context, 'measurements', 'read').then(authorization => {
            if (authorization === true) {
                return measurement.findOne({
                    where: {
                        id: id
                    }
                });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * addMeasurement - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMeasurement: function(input, context) {
        return checkAuthorization(context, 'measurements', 'create').then(authorization => {
            if (authorization === true) {
                return measurement.create(input)
                    .then(measurement => {
                        return measurement;
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * bulkAddMeasurementXlsx - Load xlsx file of records NO STREAM
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMeasurementXlsx: function(_, context) {
        return checkAuthorization(context, 'measurements', 'create').then(authorization => {
            if (authorization === true) {
                let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
                return measurement.bulkCreate(xlsxObjs, {
                    validate: true
                });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * bulkAddMeasurementCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMeasurementCsv: function(_, context) {
        return checkAuthorization(context, 'measurements', 'create').then(authorization => {
            if (authorization === true) {
                delim = context.request.body.delim;
                cols = context.request.body.cols;
                tmpFile = path.join(__dirname, uuidv4() + '.csv')
                return context.request.files.csv_file.mv(tmpFile).then(() => {
                    return fileTools.parseCsvStream(tmpFile, measurement, delim, cols)
                }).catch((err) => {
                    return new Error(err);
                }).then(() => {
                    fs.unlinkSync(tmpFile)
                })
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * deleteMeasurement - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMeasurement: function({
        id
    }, context) {
        return checkAuthorization(context, 'measurements', 'delete').then(authorization => {
            if (authorization === true) {
                return measurement.findById(id)
                    .then(measurement => {
                        return measurement.destroy()
                            .then(() => {
                                return 'Item succesfully deleted';
                            });
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * updateMeasurement - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMeasurement: function(input, context) {
        return checkAuthorization(context, 'measurements', 'update').then(authorization => {
            if (authorization === true) {
                return measurement.findById(input.id)
                    .then(measurement => {
                        return measurement.update(input);
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * countMeasurements - Count number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMeasurements: function({
        search
    }, context) {
        return checkAuthorization(context, 'measurements', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return measurement.count(options);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * vueTableMeasurement - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {type} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableMeasurement: function(_, context) {
        return checkAuthorization(context, 'measurements', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, measurement, ["id", "method", "reference", "text_value", "unit"]);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    }
}