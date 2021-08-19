module.exports = `
  type user{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    email: String

    """
    @original-field
    
    """
    password: String

      
    """
    @search-request
    """
    rolesFilter(search: searchRoleInput, order: [ orderRoleInput ], pagination: paginationInput!): [role]


    """
    @search-request
    """
    rolesConnection(search: searchRoleInput, order: [ orderRoleInput ], pagination: paginationCursorInput!): RoleConnection

    """
    @count-request
    """
    countFilteredRoles(search: searchRoleInput) : Int
  
    }
type UserConnection{
  edges: [UserEdge]
  users: [user]
  pageInfo: pageInfo!
}

type UserEdge{
  cursor: String!
  node: user!
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
    value: String
    valueType: InputType
    operator: Operator
    search: [searchUserInput]
  }

  input orderUserInput{
    field: userField
    order: Order
  }



  type Query {
    users(search: searchUserInput, order: [ orderUserInput ], pagination: paginationInput! ): [user]
    readOneUser(id: ID!): user
    countUsers(search: searchUserInput ): Int
    vueTableUser : VueTableUser    csvTableTemplateUser: [String]
    usersConnection(search:searchUserInput, order: [ orderUserInput ], pagination: paginationCursorInput! ): UserConnection
  }

  type Mutation {
    addUser( email: String, password: String   , addRoles:[ID] , skipAssociationsExistenceChecks:Boolean = false): user!
    updateUser(id: ID!, email: String, password: String   , addRoles:[ID], removeRoles:[ID]  , skipAssociationsExistenceChecks:Boolean = false): user!
    deleteUser(id: ID!): String!
    bulkAddUserCsv: String!
      }
`;