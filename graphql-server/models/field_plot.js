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
    var field_plot = sequelize.define('field_plot', {

        field_name: {
            type: Sequelize.STRING
        },
        coordinates_or_name: {
            type: Sequelize.STRING
        },
        year: {
            type: Sequelize.STRING
        },
        area_sqm: {
            type: Sequelize.FLOAT
        },
        type: {
            type: Sequelize.STRING
        }
    });

    field_plot.associate = function(models) {
        field_plot.belongsTo(models.genotype, {
            as: 'genotype',
            foreignKey: 'genotype_id'
        });
    };

    return field_plot;
};