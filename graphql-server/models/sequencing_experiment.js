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
    var sequencing_experiment = sequelize.define('sequencing_experiment', {

        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        start_date: {
            type: Sequelize.STRING
        },
        end_date: {
            type: Sequelize.STRING
        },
        protocol: {
            type: Sequelize.STRING
        },
        platform: {
            type: Sequelize.STRING
        },
        data_type: {
            type: Sequelize.STRING
        },
        library_type: {
            type: Sequelize.STRING
        },
        library_preparation: {
            type: Sequelize.STRING
        },
        aimed_coverage: {
            type: Sequelize.FLOAT
        },
        resulting_coverage: {
            type: Sequelize.FLOAT
        },
        insert_size: {
            type: Sequelize.FLOAT
        },
        aimed_read_length: {
            type: Sequelize.STRING
        },
        genome_complexity_reduction: {
            type: Sequelize.STRING
        },
        contamination: {
            type: Sequelize.STRING
        }
    });

    sequencing_experiment.associate = function(models) {
        sequencing_experiment.hasMany(models.nuc_acid_library_result, {
            as: 'nuc_acid_library_results',
            foreignKey: 'sequencing_experiment_id'
        });
        sequencing_experiment.hasMany(models.sample, {
            as: 'samples',
            foreignKey: 'sequencing_experiment_id'
        });
    };

    return sequencing_experiment;
};