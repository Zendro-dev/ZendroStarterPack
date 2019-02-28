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
    var user = sequelize.define('user', {

        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });

    user.associate = function(models) {
        user.belongsToMany(models.role, {
            through: 'role_to_user',
            onDelete: 'CASCADE'
        });
    };

    return user;
};