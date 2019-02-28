'use strict';

/**
 * @module - Migrations to creates a through table correspondant to manay-to-many association between two sequelize models.
 */
module.exports = {

    /**
     * up - Creates a table in the database for storing a many-to-many association
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was succesfully created.
     */
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('role_to_user', {

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            userId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'users',
                    key: 'id'
                }
            },

            roleId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'roles',
                    key: 'id'
                }
            }
        }).then(() => {
            return queryInterface.addIndex('role_to_user', ['userId']);
        }).then(() => {
            return queryInterface.addIndex('role_to_user', ['roleId']);
        });
    },

    /**
     * down - Deletes a table in the database for storing a many-to-many association
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was succesfully deleted.
     */
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('role_to_user');
    }

};