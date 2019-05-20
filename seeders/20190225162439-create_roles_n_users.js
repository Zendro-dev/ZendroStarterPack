'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'SELECT 1 FROM db_was_seeded LIMIT 0').then(function(x) {
      console.log('Database was already seeded, no new records are inserted.')
    }).catch(function(e) {
      // Database has not been seeded yet.
      return queryInterface.bulkInsert('roles', [{
        name: 'admin',
        description: 'The administrator is allowed to create, read, update, and delete users and their roles.'
      }, {
        name: 'scientist',
        description: 'A scientist can create, update, and delete data of the various data models, excluding users and user-roles.'
      }, {
        name: 'guest',
        description: 'A guest is allowed read access to all data models, excluding users and user-roles.'
      }]).then(function(x) {
        return queryInterface.bulkInsert('users', [{
          email: 'asis.hallab@gmail.com',
          password: 'admin'
        }])
      }).then(function(x) {
        return queryInterface.sequelize.query(
          'INSERT INTO role_to_user ("userId", "roleId") VALUES ' +
          '( (SELECT (id) FROM users WHERE email = \'asis.hallab@gmail.com\'), ' +
          '(SELECT (id) FROM roles WHERE name = \'admin\') ), ' +
          '( (SELECT (id) FROM users WHERE email = \'asis.hallab@gmail.com\'), ' +
          '(SELECT (id) FROM roles WHERE name = \'scientist\') ), ' +
          '( (SELECT (id) FROM users WHERE email = \'asis.hallab@gmail.com\'), ' +
          '(SELECT (id) FROM roles WHERE name = \'guest\') )'
        )
      }).then(function(x) {
        return queryInterface.sequelize.query(
          'CREATE TABLE db_was_seeded ( seeded INT )')
      }).then(function(x) {
        return queryInterface.sequelize.query(
          'INSERT INTO db_was_seeded (seeded) VALUES (1)')
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {}).then(u => {
      return queryInterface.bulkDelete('role_to_user', null, {})
    }).then(r => {
      return queryInterface.bulkDelete('roles', null, {})
    });
  }
};
