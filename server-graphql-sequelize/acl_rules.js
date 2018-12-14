module.exports = {
  aclRules: [{
    roles: 'administrator',
    allows: [{
      resources: '*',
      permissions: '*'
    }]
  },
  {
    roles: 'guest',
    allows: [{
      resources: ['dogs', 'people'],
      permissions: 'read'
    }]
  }]
}
