module.exports = `
  type book{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    title: String

    """
    @original-field
    
    """
    pages: Int

    """
    @original-field
    
    """
    genre: String

      
    """
    @search-request
    """
    attachmentsFilter(search: searchAttachmentInput, order: [ orderAttachmentInput ], pagination: paginationInput!): [attachment]


    """
    @search-request
    """
    attachmentsConnection(search: searchAttachmentInput, order: [ orderAttachmentInput ], pagination: paginationCursorInput!): AttachmentConnection

    """
    @count-request
    """
    countFilteredAttachments(search: searchAttachmentInput) : Int
  
    }
type BookConnection{
  edges: [BookEdge]
  books: [book]
  pageInfo: pageInfo!
}

type BookEdge{
  cursor: String!
  node: book!
}

  type VueTableBook{
    data : [book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum bookField {
    id
    title
    pages
    genre
  }
  
  input searchBookInput {
    field: bookField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchBookInput]
  }

  input orderBookInput{
    field: bookField
    order: Order
  }



  type Query {
    books(search: searchBookInput, order: [ orderBookInput ], pagination: paginationInput! ): [book]
    readOneBook(id: ID!): book
    countBooks(search: searchBookInput ): Int
    vueTableBook : VueTableBook
    csvTableTemplateBook: [String]
    booksConnection(search:searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput! ): BookConnection
  }

  type Mutation {
    addBook(id: ID!, title: String, pages: Int, genre: String   , addAttachments:[ID] , skipAssociationsExistenceChecks:Boolean = false): book!
    updateBook(id: ID!, title: String, pages: Int, genre: String   , addAttachments:[ID], removeAttachments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): book!
    deleteBook(id: ID!): String!
    bulkAddBookCsv: String!
      }
`;