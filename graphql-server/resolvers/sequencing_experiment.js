/*
    Resolvers for basic CRUD operations
*/

const sequencing_experiment = require('../models/index').sequencing_experiment;
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
 * sequencing_experiment.prototype.nuc_acid_library_resultsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sequencing_experiment.prototype.nuc_acid_library_resultsFilter = function({
    search,
    order,
    pagination
}, context) {
    if (search === undefined) {
        return resolvers.nuc_acid_library_results({
            "search": {
                "field": "sequencing_experiment_id",
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
                    "field": "sequencing_experiment_id",
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
 * sequencing_experiment.prototype.countFilteredNuc_acid_library_results - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sequencing_experiment.prototype.countFilteredNuc_acid_library_results = function({
    search
}, context) {

    if (search === undefined) {
        return resolvers.countNuc_acid_library_results({
            "search": {
                "field": "sequencing_experiment_id",
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
                    "field": "sequencing_experiment_id",
                    "value": {
                        "value": this.id
                    },
                    "operator": "eq"
                }, search]
            }
        }, context)
    }
}


/**
 * sequencing_experiment.prototype.samplesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sequencing_experiment.prototype.samplesFilter = function({
    search,
    order,
    pagination
}, context) {
    if (search === undefined) {
        return resolvers.samples({
            "search": {
                "field": "sequencing_experiment_id",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            },
            order,
            pagination
        }, context);
    } else {
        return resolvers.samples({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "sequencing_experiment_id",
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
 * sequencing_experiment.prototype.countFilteredSamples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sequencing_experiment.prototype.countFilteredSamples = function({
    search
}, context) {

    if (search === undefined) {
        return resolvers.countSamples({
            "search": {
                "field": "sequencing_experiment_id",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            }
        }, context);
    } else {
        return resolvers.countSamples({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "sequencing_experiment_id",
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
     * sequencing_experiments - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    sequencing_experiments: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return sequencing_experiment.count(options).then(items => {
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
                        throw new Error(`Request of total sequencing_experiments exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                    }
                    return sequencing_experiment.findAll(options);
                });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * readOneSequencing_experiment - Check user authorization and return one book with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSequencing_experiment: function({
        id
    }, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'read').then(authorization => {
            if (authorization === true) {
                return sequencing_experiment.findOne({
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
     * addSequencing_experiment - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSequencing_experiment: function(input, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'create').then(authorization => {
            if (authorization === true) {
                return sequencing_experiment.create(input)
                    .then(sequencing_experiment => {
                        if (input.addNuc_acid_library_results) {
                            sequencing_experiment.setNuc_acid_library_results(input.addNuc_acid_library_results);
                        }
                        if (input.addSamples) {
                            sequencing_experiment.setSamples(input.addSamples);
                        }
                        return sequencing_experiment;
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * bulkAddSequencing_experimentXlsx - Load xlsx file of records NO STREAM
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSequencing_experimentXlsx: function(_, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'create').then(authorization => {
            if (authorization === true) {
                let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
                return sequencing_experiment.bulkCreate(xlsxObjs, {
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
     * bulkAddSequencing_experimentCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSequencing_experimentCsv: function(_, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'create').then(authorization => {
            if (authorization === true) {
                delim = context.request.body.delim;
                cols = context.request.body.cols;
                tmpFile = path.join(__dirname, uuidv4() + '.csv')
                return context.request.files.csv_file.mv(tmpFile).then(() => {
                    return fileTools.parseCsvStream(tmpFile, sequencing_experiment, delim, cols)
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
     * deleteSequencing_experiment - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSequencing_experiment: function({
        id
    }, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'delete').then(authorization => {
            if (authorization === true) {
                return sequencing_experiment.findById(id)
                    .then(sequencing_experiment => {
                        return sequencing_experiment.destroy()
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
     * updateSequencing_experiment - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSequencing_experiment: function(input, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'update').then(authorization => {
            if (authorization === true) {
                return sequencing_experiment.findById(input.id)
                    .then(sequencing_experiment => {
                        if (input.addNuc_acid_library_results) {
                            sequencing_experiment.addNuc_acid_library_results(input.addNuc_acid_library_results);
                        }
                        if (input.removeNuc_acid_library_results) {
                            sequencing_experiment.removeNuc_acid_library_results(input.removeNuc_acid_library_results);
                        }
                        if (input.addSamples) {
                            sequencing_experiment.addSamples(input.addSamples);
                        }
                        if (input.removeSamples) {
                            sequencing_experiment.removeSamples(input.removeSamples);
                        }
                        return sequencing_experiment.update(input);
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * countSequencing_experiments - Count number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSequencing_experiments: function({
        search
    }, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return sequencing_experiment.count(options);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * vueTableSequencing_experiment - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {type} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSequencing_experiment: function(_, context) {
        return checkAuthorization(context, 'sequencing_experiments', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, sequencing_experiment, ["id", "name", "description", "start_date", "end_date", "protocol", "platform", "data_type", "library_type", "library_preparation", "aimed_read_length", "genome_complexity_reduction", "contamination"]);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    }
}