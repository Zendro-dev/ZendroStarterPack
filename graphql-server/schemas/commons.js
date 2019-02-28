module.exports = `

  enum Operator{
    like
    or
    and
    eq
    between
    in
  }

  enum Order{
    DESC
    ASC
  }

  input typeValue{
    type: String
    value: String!
  }

  input paginationInput{
    limit: Int
    offset: Int
  }

`;