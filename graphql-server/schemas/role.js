module.exports = `
  type role  {
    id: ID
    name: String
    description: String
      usersFilter(search: searchUserInput, order: [ orderUserInput ], pagination: paginationInput): [user]
    countFilteredUsers(search: searchUserInput) : Int
  }

  type VueTableRole{
    data : [role]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum roleField {
    id 
    name  
    description  
  }

  input searchRoleInput {
    field: roleField
    value: typeValue
    operator: Operator
    search: [searchRoleInput]
  }

  input orderRoleInput{
    field: roleField
    order: Order
  }

  type Query {
    roles(search: searchRoleInput, order: [ orderRoleInput ], pagination: paginationInput ): [role]
    readOneRole(id: ID!): role
    countRoles(search: searchRoleInput ): Int
    vueTableRole : VueTableRole  }

    type Mutation {
    addRole( name: String, description: String , addUsers:[ID] ): role!
    deleteRole(id: ID!): String!
    updateRole(id: ID!, name: String, description: String , addUsers:[ID], removeUsers:[ID] ): role!
    bulkAddRoleXlsx: [role]
    bulkAddRoleCsv: [role]
}
  `;