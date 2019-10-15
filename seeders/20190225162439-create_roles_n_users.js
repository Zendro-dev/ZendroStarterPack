'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'SELECT 1 FROM db_was_seeded LIMIT 0').then(function(x) {
      console.log(
        'Database was already seeded, no new records are inserted.')
    }).catch(async function(e) {
      // Database has not been seeded yet.
      await queryInterface.bulkInsert('roles', [{
        name: 'admin',
        description: 'The administrator is allowed to create, read, update, and delete users and their roles.'
      }, {
        name: 'scientist',
        description: 'A scientist can create, update, and delete data of the various data models, excluding users and user-roles.'
      }, {
        name: 'guest',
        description: 'A guest is allowed read access to all data models, excluding users and user-roles.'
      }])
      await queryInterface.bulkInsert('users',
        [
          {
            email: "asis.hallab@gmail.com",
            password: "admin"
          },
          {
            email: "b.usadel@fz-juelich.de",
            password: "Björn01!Usadel10"
          },
          {
            email: "g.ponce@fz-juelich.de",
            password: "Yaxal09!Ponce90"
          },
          {
            email: "m.enders@npz-innovation.de",
            password: "Matthias02!Enders20"
          }
        ]
      )
      let userIds = await queryInterface.sequelize.query(
        'SELECT id FROM users')
      let roleIds = await queryInterface.sequelize.query(
        'SELECT id FROM roles')
      await queryInterface.bulkInsert('role_to_users',
        userIds[0].map((usr) => {
          return roleIds[0].map((rl) => {
            return {
              "userId": usr.id,
              "roleId": rl.id
            }
          })
        }).reduce((acc, val) => {
          return acc.concat(val)
        })
      )
      await queryInterface.sequelize.query(
        'CREATE TABLE db_was_seeded ( seeded INT )')
      await queryInterface
        .sequelize.query(
          'INSERT INTO db_was_seeded (seeded) VALUES (1)')
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {}).then(u => {
      return queryInterface.bulkDelete('role_to_users', null, {})
    }).then(r => {
      return queryInterface.bulkDelete('roles', null, {})
    });
  }
};
