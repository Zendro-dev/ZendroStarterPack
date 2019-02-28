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
    var marker_data = sequelize.define('marker_data', {

        marker_name: {
            type: Sequelize.STRING
        },
        nucleotide: {
            type: Sequelize.STRING
        }
    });

    marker_data.associate = function(models) {
        marker_data.belongsTo(models.individual, {
            as: 'individual',
            foreignKey: 'individual_id'
        });
    };

    return marker_data;
};