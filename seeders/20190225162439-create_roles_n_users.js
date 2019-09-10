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
        [{
            email: "HuanhuanTai",
            password: "Huanhuan02!Tai20"
          },
          {
            email: "Jochen.Mayer@agroscope.admin.ch",
            password: "Jochen06!Mayer60"
          },
          {
            email: "Omidbakhshfard@mpimp-golm.mpg.de",
            password: "Amin03!Omidbakhshfard30"
          },
          {
            email: "a.mahn@fz-juelich.de",
            password: "Andreas09!Mahn90"
          },
          {
            email: "asis.hallab@gmail.com",
            password: "admin"
          },
          {
            email: "b.usadel@fz-juelich.de",
            password: "Björn01!Usadel10"
          },
          {
            email: "barbara.orth@agroscope.admin.ch",
            password: "Barbara09!Orth90"
          },
          {
            email: "basler@mpimp-golm.mpg.de",
            password: "Georg01!Basler10"
          },
          {
            email: "bourceret@mpipz.mpg.de",
            password: "Amelia09!Bourceret90"
          },
          {
            email: "fernie@mpimp-golm.mpg.de",
            password: "Alisdair02!Fernie20"
          },
          {
            email: "guan@mpipz.mpg.de",
            password: "03guan!30"
          },
          {
            email: "joerg.hofmann@fau.de",
            password: "Joerg06!Hoffmann60"
          },
          {
            email: "jsix@ethz.ch",
            password: "Johan08!Six80"
          },
          {
            email: "g.ponce@fz-juelich.de",
            password: "Yaxal09!Ponce90"
          },
          {
            email: "k.dorau@uni-koeln.de",
            password: "Kristof05!Dorau50"
          },
          {
            email: "m.bucher@uni-koeln.de",
            password: "Marcel01!Bucher10"
          },
          {
            email: "mhajheid@uni-koeln.de",
            password: "02hajheid!20"
          },
          {
            email: "nikoloski@mpimp-golm.mpg.de",
            password: "Zoran04!Nikoloski40"
          },
          {
            email: "nina.gerlach@uni-koeln.de",
            password: "Nina05!Gerlach50"
          },
          {
            email: "rene.flisch@agroscope.admin.ch",
            password: "Rene07!Flisch70"
          },
          {
            email: "schlef@mpipz.mpg.de",
            password: "Paul07!Schulze70"
          },
          {
            email: "schneeberger@mpipz.mpg.de",
            password: "Korbinian10!Schneeberger10"
          },
          {
            email: "spaepen@mpipz.mpg.de",
            password: "Stijn08!Spaepen80"
          },
          {
            email: "sreicha3@uni-koeln.de",
            password: "Sina03!Reichhardt30"
          },
          {
            email: "tim.mansfeldt@uni-koeln.de",
            password: "Tim04!Mansfeldt40"
          },
          {
            email: "uwe.sonnewald@fau.de",
            password: "Uwe06!Sonnewald60"
          },
          {
            email: "walter.richner@agroscope.admin.ch",
            password: "Walter05!Richner50"
          }
        ]
      )
      let userIds = await queryInterface.sequelize.query(
        'SELECT id FROM users')
      let roleIds = await queryInterface.sequelize.query(
        'SELECT id FROM roles')
      await queryInterface.bulkInsert('role_to_user',
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
      return queryInterface.bulkDelete('role_to_user', null, {})
    }).then(r => {
      return queryInterface.bulkDelete('roles', null, {})
    });
  }
};
