/*
Data types dictionary from graphql-type to sequelize-type
*/

module.exports = {

  "Int" : 'INTEGER',
  "String": 'TEXT',
  "Float": 'FLOAT',
  "Boolean": 'BOOLEAN',
  "Date": "DATEONLY",
  "Time": "TIME",
  "DateTime": "DATE",
  "[String]": "TEXT",
  "[Int]": "TEXT",
  "[Float]": "TEXT",
  "[Boolean]": "TEXT",
  "[Date]": "TEXT",
  "[Time]": "TEXT",
  "[DateTime]": "TEXT"
}
