'use strict';

/**
 * @module - Migrations to add a column and to delete a column from a table correpondant to a sequelize model.
 */
module.exports = {

    /**
     * up - Adds a column to a specified table
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the column was succesfully added.
     */
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn('nuc_acid_library_results', 'sample_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'samples',
                key: 'id'
            }
        }).then(() => {
            return queryInterface.addIndex('nuc_acid_library_results', ['sample_id']);
        });
    },

    /**
     * down - Deletes a column to a specified table
     *
     * @param  {type} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the column was succesfully deleted.
     */
    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('nuc_acid_library_results', 'sample_id');
    }

};