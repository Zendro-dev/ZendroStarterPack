/*
    Resolvers for basic CRUD operations
*/

const breeding_pool = require('../models/index').breeding_pool;
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
 * breeding_pool.prototype.genotypesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
breeding_pool.prototype.genotypesFilter = function({
    search,
    order,
    pagination
}, context) {
    if (search === undefined) {
        return resolvers.genotypes({
            "search": {
                "field": "breeding_pool_id",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            },
            order,
            pagination
        }, context);
    } else {
        return resolvers.genotypes({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "breeding_pool_id",
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
 * breeding_pool.prototype.countFilteredGenotypes - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
breeding_pool.prototype.countFilteredGenotypes = function({
    search
}, context) {

    if (search === undefined) {
        return resolvers.countGenotypes({
            "search": {
                "field": "breeding_pool_id",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            }
        }, context);
    } else {
        return resolvers.countGenotypes({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "breeding_pool_id",
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
     * breeding_pools - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    breeding_pools: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'breeding_pools', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return breeding_pool.count(options).then(items => {
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
                        throw new Error(`Request of total breeding_pools exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                    }
                    return breeding_pool.findAll(options);
                });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * readOneBreeding_pool - Check user authorization and return one book with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneBreeding_pool: function({
        id
    }, context) {
        return checkAuthorization(context, 'breeding_pools', 'read').then(authorization => {
            if (authorization === true) {
                return breeding_pool.findOne({
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
     * addBreeding_pool - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addBreeding_pool: function(input, context) {
        return checkAuthorization(context, 'breeding_pools', 'create').then(authorization => {
            if (authorization === true) {
                return breeding_pool.create(input)
                    .then(breeding_pool => {
                        if (input.addGenotypes) {
                            breeding_pool.setGenotypes(input.addGenotypes);
                        }
                        return breeding_pool;
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * bulkAddBreeding_poolXlsx - Load xlsx file of records NO STREAM
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddBreeding_poolXlsx: function(_, context) {
        return checkAuthorization(context, 'breeding_pools', 'create').then(authorization => {
            if (authorization === true) {
                let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
                return breeding_pool.bulkCreate(xlsxObjs, {
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
     * bulkAddBreeding_poolCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddBreeding_poolCsv: function(_, context) {
        return checkAuthorization(context, 'breeding_pools', 'create').then(authorization => {
            if (authorization === true) {
                delim = context.request.body.delim;
                cols = context.request.body.cols;
                tmpFile = path.join(__dirname, uuidv4() + '.csv')
                return context.request.files.csv_file.mv(tmpFile).then(() => {
                    return fileTools.parseCsvStream(tmpFile, breeding_pool, delim, cols)
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
     * deleteBreeding_pool - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    Id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteBreeding_pool: function({
        id
    }, context) {
        return checkAuthorization(context, 'breeding_pools', 'delete').then(authorization => {
            if (authorization === true) {
                return breeding_pool.findById(id)
                    .then(breeding_pool => {
                        return breeding_pool.destroy()
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
     * updateBreeding_pool - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateBreeding_pool: function(input, context) {
        return checkAuthorization(context, 'breeding_pools', 'update').then(authorization => {
            if (authorization === true) {
                return breeding_pool.findById(input.id)
                    .then(breeding_pool => {
                        if (input.addGenotypes) {
                            breeding_pool.addGenotypes(input.addGenotypes);
                        }
                        if (input.removeGenotypes) {
                            breeding_pool.removeGenotypes(input.removeGenotypes);
                        }
                        return breeding_pool.update(input);
                    });
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * countBreeding_pools - Count number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countBreeding_pools: function({
        search
    }, context) {
        return checkAuthorization(context, 'breeding_pools', 'read').then(authorization => {
            if (authorization === true) {
                let options = {};
                if (search !== undefined) {
                    let arg = new searchArg(search);
                    let arg_sequelize = arg.toSequelize();
                    options['where'] = arg_sequelize;
                }

                return breeding_pool.count(options);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    },

    /**
     * vueTableBreeding_pool - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {type} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableBreeding_pool: function(_, context) {
        return checkAuthorization(context, 'breeding_pools', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, breeding_pool, ["id", "name", "description"]);
            } else {
                return new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            handleError(error);
        })
    }
}