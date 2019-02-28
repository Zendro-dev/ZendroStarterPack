/*
    Resolvers for basic CRUD operations
*/

const sample = require('../models/index').sample;
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
 * sample.prototype.individual - Return associated record
 *
 * @param  {string} _       First parameter is not used
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sample.prototype.individual = function(_, context) {
    return resolvers.readOneIndividual({
        "id": this.individual_id
    }, context);
}
/**
 * sample.prototype.sequencing_experiment - Return associated record
 *
 * @param  {string} _       First parameter is not used
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sample.prototype.sequencing_experiment = function(_, context) {
    return resolvers.readOneSequencing_experiment({
        "id": this.sequencing_experiment_id
    }, context);
}




/**
 * sample.prototype.library_dataFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sample.prototype.library_dataFilter = function({
    search,
    order,
    pagination
}, context) {
    if (search === undefined) {
        return resolvers.nuc_acid_library_results({
            "search": {
                "field": "sample_id",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            },
            order,
            pagination
        }, context);
    } else {
        return resolvers.nuc_acid_library_results({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "sample_id",
                    "value": {
                        "value": this.id
                    },
                    "operator": "eq"
                }, search]
            },
            order,
            pagination
        }, context)
    }
}

/**
 * sample.prototype.countFilteredLibrary_data - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sample.prototype.countFilteredLibrary_data = function({
    search
}, context) {

    if (search === undefined) {
        return resolvers.countNuc_acid_library_results({
            "search": {
                "field": "sample_id",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            }
        }, context);
    } else {
        return resolvers.countNuc_acid_library_results({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "sample_id",
                    "value": {
                        "value": this.id
                    },
                    "operator": "eq"
                }, search]
            }
        }, context)
    }
}





module.exports = {

    /**
     * samples - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    samples: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'samples', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return sample.count(options).then(items => {
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
                        throw new Error(`Request of total samples exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                    }
                    return sample.findAll(options);
                });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * readOneSample - Check user authorization and return one book with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSample: function({
        id
    }, context) {
        return checkAuthorization(context, 'samples', 'read').then(authorization => {
            if (authorization === true) {
                return sample.findOne({
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
     * addSample - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSample: function(input, context) {
        return checkAuthorization(context, 'samples', 'create').then(authorization => {
            if (authorization === true) {
                return sample.create(input)
                    .then(sample => {
                        if (input.addNuc_acid_library_results) {
                            sample.setNuc_acid_library_results(input.addNuc_acid_library_results);
                        }
                        return sample;
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * bulkAddSampleXlsx - Load xlsx file of records NO STREAM
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSampleXlsx: function(_, context) {
        return checkAuthorization(context, 'samples', 'create').then(authorization => {
            if (authorization === true) {
                let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
                return sample.bulkCreate(xlsxObjs, {
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
     * bulkAddSampleCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSampleCsv: function(_, context) {
        return checkAuthorization(context, 'samples', 'create').then(authorization => {
            if (authorization === true) {
                delim = context.request.body.delim;
                cols = context.request.body.cols;
                tmpFile = path.join(__dirname, uuidv4() + '.csv')
                return context.request.files.csv_file.mv(tmpFile).then(() => {
                    return fileTools.parseCsvStream(tmpFile, sample, delim, cols)
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
     * deleteSample - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSample: function({
        id
    }, context) {
        return checkAuthorization(context, 'samples', 'delete').then(authorization => {
            if (authorization === true) {
                return sample.findById(id)
                    .then(sample => {
                        return sample.destroy()
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
     * updateSample - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSample: function(input, context) {
        return checkAuthorization(context, 'samples', 'update').then(authorization => {
            if (authorization === true) {
                return sample.findById(input.id)
                    .then(sample => {
                        if (input.addNuc_acid_library_results) {
                            sample.addNuc_acid_library_results(input.addNuc_acid_library_results);
                        }
                        if (input.removeNuc_acid_library_results) {
                            sample.removeNuc_acid_library_results(input.removeNuc_acid_library_results);
                        }
                        return sample.update(input);
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * countSamples - Count number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSamples: function({
        search
    }, context) {
        return checkAuthorization(context, 'samples', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return sample.count(options);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * vueTableSample - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {type} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSample: function(_, context) {
        return checkAuthorization(context, 'samples', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, sample, ["id", "name", "sampling_date", "type", "lab_code", "treatment", "tissue"]);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    }
}