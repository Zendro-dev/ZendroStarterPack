module.exports = `

  enum InputType{
    Array
    String
    Int
    Float
    Boolean
    Date
    Time
    DateTime
  }
  
  enum GenericPrestoSqlOperator {
		like notLike iLike notILike regexp notRegexp iRegexp notIRegexp
		eq gt gte lt lte ne between notBetween
		in notIn contains notContains
		or and not
	}	

	enum MongodbNeo4jOperator {
		like notLike iLike notILike regexp notRegexp iRegexp notIRegexp
		eq gt gte lt lte ne
		in notIn contains notContains
		or and not
	}	

	enum CassandraOperator {
		eq gt gte lt lte ne
		in contains
		and
	}	

  enum AmazonS3Operator {
    like notLike iLike notILike
    eq gt gte lt lte ne between notBetween
    in notIn contains notContains
    or and not
  }	

  enum Order{
    DESC
    ASC
  }

  input paginationInput{
    limit: Int!
    offset: Int
  }

  input paginationCursorInput{
    first: Int
    last: Int
    after: String
    before: String
    includeCursor: Boolean
  }

  type pageInfo{
    startCursor: String
    endCursor: String
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  scalar Date
  scalar Time
  scalar DateTime
  scalar Upload
`;