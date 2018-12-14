const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $and: Op.and,
  $or: Op.or,
  $like: Op.like,
  $between: Op.between,
  $in: Op.in
};
const environment = process.env.NODE_ENV || "development"
const sequelizeConfig = require('./config/config.json')[environment]

sequelize = new Sequelize(
  sequelizeConfig
);

module.exports = sequelize;
