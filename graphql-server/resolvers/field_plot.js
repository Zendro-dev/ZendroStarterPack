/*
    Resolvers for basic CRUD operations
*/

const field_plot = require('../models/index').field_plot;
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
 * field_plot.prototype.genotype - Return associated record
 *
 * @param  {string} _       First parameter is not used
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
field_plot.prototype.genotype = function(_, context) {
    return resolvers.readOneGenotype({
        "id": this.genotype_id
    }, context);
}







module.exports = {

    /**
     * field_plots - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    field_plots: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'field_plots', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return field_plot.count(options).then(items => {
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
                        throw new Error(`Request of total field_plots exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                    }
                    return field_plot.findAll(options);
                });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * readOneField_plot - Check user authorization and return one book with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneField_plot: function({
        id
    }, context) {
        return checkAuthorization(context, 'field_plots', 'read').then(authorization => {
            if (authorization === true) {
                return field_plot.findOne({
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
     * addField_plot - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addField_plot: function(input, context) {
        return checkAuthorization(context, 'field_plots', 'create').then(authorization => {
            if (authorization === true) {
                return field_plot.create(input)
                    .then(field_plot => {
                        return field_plot;
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * bulkAddField_plotXlsx - Load xlsx file of records NO STREAM
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddField_plotXlsx: function(_, context) {
        return checkAuthorization(context, 'field_plots', 'create').then(authorization => {
            if (authorization === true) {
                let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
                return field_plot.bulkCreate(xlsxObjs, {
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
     * bulkAddField_plotCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddField_plotCsv: function(_, context) {
        return checkAuthorization(context, 'field_plots', 'create').then(authorization => {
            if (authorization === true) {
                delim = context.request.body.delim;
                cols = context.request.body.cols;
                tmpFile = path.join(__dirname, uuidv4() + '.csv')
                return context.request.files.csv_file.mv(tmpFile).then(() => {
                    return fileTools.parseCsvStream(tmpFile, field_plot, delim, cols)
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
     * deleteField_plot - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteField_plot: function({
        id
    }, context) {
        return checkAuthorization(context, 'field_plots', 'delete').then(authorization => {
            if (authorization === true) {
                return field_plot.findById(id)
                    .then(field_plot => {
                        return field_plot.destroy()
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
     * updateField_plot - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateField_plot: function(input, context) {
        return checkAuthorization(context, 'field_plots', 'update').then(authorization => {
            if (authorization === true) {
                return field_plot.findById(input.id)
                    .then(field_plot => {
                        return field_plot.update(input);
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * countField_plots - Count number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countField_plots: function({
        search
    }, context) {
        return checkAuthorization(context, 'field_plots', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return field_plot.count(options);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * vueTableField_plot - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {type} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableField_plot: function(_, context) {
        return checkAuthorization(context, 'field_plots', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, field_plot, ["id", "field_name", "coordinates_or_name", "year", "type"]);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    }
}