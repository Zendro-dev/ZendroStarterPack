module.exports = `
  type user  {
    id: ID
    email: String
    password: String
      rolesFilter(search: searchRoleInput, order: [ orderRoleInput ], pagination: paginationInput): [role]
    countFilteredRoles(search: searchRoleInput) : Int
  }

  type VueTableUser{
    data : [user]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum userField {
    id 
    email  
    password  
  }

  input searchUserInput {
    field: userField
    value: typeValue
    operator: Operator
    search: [searchUserInput]
  }

  input orderUserInput{
    field: userField
    order: Order
  }

  type Query {
    users(search: searchUserInput, order: [ orderUserInput ], pagination: paginationInput ): [user]
    readOneUser(id: ID!): user
    countUsers(search: searchUserInput ): Int
    vueTableUser : VueTableUser  }

    type Mutation {
    addUser( email: String, password: String , addRoles:[ID] ): user!
    deleteUser(id: ID!): String!
    updateUser(id: ID!, email: String, password: String , addRoles:[ID], removeRoles:[ID] ): user!
    bulkAddUserXlsx: [user]
    bulkAddUserCsv: [user]
}
  `;