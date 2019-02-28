'use strict';

/**
 * @module - Migrations to create and to undo a table correpondant to a sequelize model.
 */
module.exports = {

    /**
     * up - Creates a table with the fields specified in the the createTable function.
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was created successfully, rejected otherwise.
     */
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('nuc_acid_library_results', {

            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

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
    },

    /**
     * down - Deletes a table.
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was deleted successfully, rejected otherwise.
     */
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('nuc_acid_library_results');
    }

};