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
    var transcript_count = sequelize.define('transcript_count', {

        gene: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.FLOAT
        },
        method: {
            type: Sequelize.STRING
        },
        reference_genome: {
            type: Sequelize.STRING
        }
    });

    transcript_count.associate = function(models) {
        transcript_count.belongsTo(models.sample, {
            as: 'sample',
            foreignKey: 'sample_id'
        });
    };

    return transcript_count;
};