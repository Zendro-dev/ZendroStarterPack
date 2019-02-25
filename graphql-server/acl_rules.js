module.exports = {
  aclRules: [{
    roles: 'admin',
    allows: [{
      resources: ['users', 'roles'],
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
