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
    var genotype = sequelize.define('genotype', {

        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        pedigree_type: {
            type: Sequelize.STRING
        }
    });

    genotype.associate = function(models) {
        genotype.belongsTo(models.individual, {
            as: 'mother',
            foreignKey: 'mother_id'
        });
        genotype.belongsTo(models.individual, {
            as: 'father',
            foreignKey: 'father_id'
        });
        genotype.belongsTo(models.breeding_pool, {
            as: 'breeding_pool',
            foreignKey: 'breeding_pool_id'
        });
    };

    return genotype;
};