#!/usr/bin/env node

const path = require('path')
const Sequelize = require(path.join(__dirname, '..', 'connection.js'))

async function checkConnection() {
  try {
    await Sequelize.authenticate()
    return process.exit(0)
  } catch (exception) {
    return process.exit(1)
  }
}

checkConnection()
