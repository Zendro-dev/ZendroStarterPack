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
    var measurement = sequelize.define('measurement', {

        method: {
            type: Sequelize.STRING
        },
        reference: {
            type: Sequelize.STRING
        },
        float_value: {
            type: Sequelize.FLOAT
        },
        int_value: {
            type: Sequelize.INTEGER
        },
        text_value: {
            type: Sequelize.STRING
        },
        unit: {
            type: Sequelize.STRING
        }
    });

    measurement.associate = function(models) {
        measurement.belongsTo(models.field_plot, {
            as: 'field_plot',
            foreignKey: 'field_plot_id'
        });
    };

    return measurement;
};