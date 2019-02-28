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
    var individual = sequelize.define('individual', {

        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });

    individual.associate = function(models) {
        individual.belongsTo(models.genotype, {
            as: 'genotype',
            foreignKey: 'genotype_id'
        });
        individual.hasMany(models.marker_data, {
            as: 'marker_data_snps',
            foreignKey: 'individual_id'
        });
    };

    return individual;
};