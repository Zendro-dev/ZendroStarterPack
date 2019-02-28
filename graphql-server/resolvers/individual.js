/*
    Resolvers for basic CRUD operations
*/

const individual = require('../models/index').individual;
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
 * individual.prototype.genotype - Return associated record
 *
 * @param  {string} _       First parameter is not used
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
individual.prototype.genotype = function(_, context) {
    return resolvers.readOneGenotype({
        "id": this.genotype_id
    }, context);
}




/**
 * individual.prototype.marker_data_snpsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
individual.prototype.marker_data_snpsFilter = function({
    search,
    order,
    pagination
}, context) {
    if (search === undefined) {
        return resolvers.marker_data({
            "search": {
                "field": "individual_id",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            },
            order,
            pagination
        }, context);
    } else {
        return resolvers.marker_data({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "individual_id",
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
 * individual.prototype.countFilteredMarker_data_snps - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
individual.prototype.countFilteredMarker_data_snps = function({
    search
}, context) {

    if (search === undefined) {
        return resolvers.countMarker_data({
            "search": {
                "field": "individual_id",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            }
        }, context);
    } else {
        return resolvers.countMarker_data({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "individual_id",
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
     * individuals - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    individuals: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'individuals', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return individual.count(options).then(items => {
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
                        throw new Error(`Request of total individuals exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                    }
                    return individual.findAll(options);
                });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * readOneIndividual - Check user authorization and return one book with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneIndividual: function({
        id
    }, context) {
        return checkAuthorization(context, 'individuals', 'read').then(authorization => {
            if (authorization === true) {
                return individual.findOne({
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
     * addIndividual - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addIndividual: function(input, context) {
        return checkAuthorization(context, 'individuals', 'create').then(authorization => {
            if (authorization === true) {
                return individual.create(input)
                    .then(individual => {
                        if (input.addMarker_data) {
                            individual.setMarker_data(input.addMarker_data);
                        }
                        return individual;
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * bulkAddIndividualXlsx - Load xlsx file of records NO STREAM
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddIndividualXlsx: function(_, context) {
        return checkAuthorization(context, 'individuals', 'create').then(authorization => {
            if (authorization === true) {
                let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
                return individual.bulkCreate(xlsxObjs, {
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
     * bulkAddIndividualCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddIndividualCsv: function(_, context) {
        return checkAuthorization(context, 'individuals', 'create').then(authorization => {
            if (authorization === true) {
                delim = context.request.body.delim;
                cols = context.request.body.cols;
                tmpFile = path.join(__dirname, uuidv4() + '.csv')
                return context.request.files.csv_file.mv(tmpFile).then(() => {
                    return fileTools.parseCsvStream(tmpFile, individual, delim, cols)
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
     * deleteIndividual - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteIndividual: function({
        id
    }, context) {
        return checkAuthorization(context, 'individuals', 'delete').then(authorization => {
            if (authorization === true) {
                return individual.findById(id)
                    .then(individual => {
                        return individual.destroy()
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
     * updateIndividual - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateIndividual: function(input, context) {
        return checkAuthorization(context, 'individuals', 'update').then(authorization => {
            if (authorization === true) {
                return individual.findById(input.id)
                    .then(individual => {
                        if (input.addMarker_data) {
                            individual.addMarker_data(input.addMarker_data);
                        }
                        if (input.removeMarker_data) {
                            individual.removeMarker_data(input.removeMarker_data);
                        }
                        return individual.update(input);
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * countIndividuals - Count number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countIndividuals: function({
        search
    }, context) {
        return checkAuthorization(context, 'individuals', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return individual.count(options);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * vueTableIndividual - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {type} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableIndividual: function(_, context) {
        return checkAuthorization(context, 'individuals', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, individual, ["id", "name", "description"]);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    }
}