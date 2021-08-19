module.exports = `
  type role{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    description: String

      
    """
    @search-request
    """
    usersFilter(search: searchUserInput, order: [ orderUserInput ], pagination: paginationInput!): [user]


    """
    @search-request
    """
    usersConnection(search: searchUserInput, order: [ orderUserInput ], pagination: paginationCursorInput!): UserConnection

    """
    @count-request
    """
    countFilteredUsers(search: searchUserInput) : Int
  
    }
type RoleConnection{
  edges: [RoleEdge]
  roles: [role]
  pageInfo: pageInfo!
}

type RoleEdge{
  cursor: String!
  node: role!
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
    value: String
    valueType: InputType
    operator: Operator
    search: [searchRoleInput]
  }

  input orderRoleInput{
    field: roleField
    order: Order
  }



  type Query {
    roles(search: searchRoleInput, order: [ orderRoleInput ], pagination: paginationInput! ): [role]
    readOneRole(id: ID!): role
    countRoles(search: searchRoleInput ): Int
    vueTableRole : VueTableRole    csvTableTemplateRole: [String]
    rolesConnection(search:searchRoleInput, order: [ orderRoleInput ], pagination: paginationCursorInput! ): RoleConnection
  }

  type Mutation {
    addRole( name: String, description: String   , addUsers:[ID] , skipAssociationsExistenceChecks:Boolean = false): role!
    updateRole(id: ID!, name: String, description: String   , addUsers:[ID], removeUsers:[ID]  , skipAssociationsExistenceChecks:Boolean = false): role!
    deleteRole(id: ID!): String!
    bulkAddRoleCsv: String!
      }
`;