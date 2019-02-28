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
        return queryInterface.createTable('sequencing_experiments', {

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
    },

    /**
     * down - Deletes a table.
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was deleted successfully, rejected otherwise.
     */
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('sequencing_experiments');
    }

};