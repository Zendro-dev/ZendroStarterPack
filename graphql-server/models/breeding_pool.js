'use strict';

const Sequelize = require('sequelize');

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */
module.exports = function(sequelize, DataTypes) {
    var breeding_pool = sequelize.define('breeding_pool', {

        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });

    breeding_pool.associate = function(models) {
        breeding_pool.hasMany(models.genotype, {
            as: 'genotypes',
            foreignKey: 'breeding_pool_id'
        });
    };

    return breeding_pool;
};