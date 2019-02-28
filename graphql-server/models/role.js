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
    var role = sequelize.define('role', {

        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });

    role.associate = function(models) {
        role.belongsToMany(models.user, {
            through: 'role_to_user',
            onDelete: 'CASCADE'
        });
    };

    return role;
};