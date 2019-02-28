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
    var nuc_acid_library_result = sequelize.define('nuc_acid_library_result', {

        lab_code: {
            type: Sequelize.STRING
        },
        file_name: {
            type: Sequelize.STRING
        },
        file_uri: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        insert_size: {
            type: Sequelize.FLOAT
        },
        technical_replicate: {
            type: Sequelize.INTEGER
        },
        trimmed: {
            type: Sequelize.BOOLEAN
        }
    });

    nuc_acid_library_result.associate = function(models) {
        nuc_acid_library_result.belongsTo(models.sample, {
            as: 'sample',
            foreignKey: 'sample_id'
        });
    };

    return nuc_acid_library_result;
};