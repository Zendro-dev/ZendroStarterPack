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
    var sample = sequelize.define('sample', {

        name: {
            type: Sequelize.STRING
        },
        sampling_date: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        biological_replicate_no: {
            type: Sequelize.INTEGER
        },
        lab_code: {
            type: Sequelize.STRING
        },
        treatment: {
            type: Sequelize.STRING
        },
        tissue: {
            type: Sequelize.STRING
        }
    });

    sample.associate = function(models) {
        sample.belongsTo(models.individual, {
            as: 'individual',
            foreignKey: 'individual_id'
        });
        sample.belongsTo(models.sequencing_experiment, {
            as: 'sequencing_experiment',
            foreignKey: 'sequencing_experiment_id'
        });
        sample.hasMany(models.nuc_acid_library_result, {
            as: 'library_data',
            foreignKey: 'sample_id'
        });
    };

    return sample;
};