module.exports = `
  type attachment{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    fileName: String

    """
    @original-field
    
    """
    fileURL: String

    """
    @original-field
    
    """
    mimeType: String

    """
    @original-field
    
    """
    fileSize: Int

    """
    @original-field
    
    """
    identifierName: String

    urlThumbnail(width: Int!, height: Int!, format:String! ): String!

    """
    @original-field
    
    """
    book_id: String

    book(search: searchBookInput): book
    
    }
type AttachmentConnection{
  edges: [AttachmentEdge]
  attachments: [attachment]
  pageInfo: pageInfo!
}

type AttachmentEdge{
  cursor: String!
  node: attachment!
}

  type VueTableAttachment{
    data : [attachment]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum attachmentField {
    id
    fileName
    fileURL
    mimeType
    fileSize
    identifierName
    book_id
  }
  
  input searchAttachmentInput {
    field: attachmentField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchAttachmentInput]
  }

  input orderAttachmentInput{
    field: attachmentField
    order: Order
  }

  input bulkAssociationAttachmentWithBook_idInput{
    id: ID!
    book_id: ID!
  }

  type Query {
    attachments(search: searchAttachmentInput, order: [ orderAttachmentInput ], pagination: paginationInput! ): [attachment]
    readOneAttachment(id: ID!): attachment
    countAttachments(search: searchAttachmentInput ): Int
    vueTableAttachment : VueTableAttachment
    csvTableTemplateAttachment: [String]
    attachmentsConnection(search:searchAttachmentInput, order: [ orderAttachmentInput ], pagination: paginationCursorInput! ): AttachmentConnection
  }

  type Mutation {
    uploadAttachment(file: Upload): attachment
    addAttachment(id: ID!, file: Upload, fileName: String, fileURL: String, mimeType: String, fileSize: Int, identifierName: String , addBook:ID   , skipAssociationsExistenceChecks:Boolean = false): attachment!
    updateAttachment(id: ID!, fileName: String, fileURL: String, mimeType: String, fileSize: Int, identifierName: String , addBook:ID, removeBook:ID    , skipAssociationsExistenceChecks:Boolean = false): attachment!
    deleteAttachment(id: ID!): String!
    bulkAddAttachmentCsv: String!
    bulkAssociateAttachmentWithBook_id(bulkAssociationInput: [bulkAssociationAttachmentWithBook_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateAttachmentWithBook_id(bulkAssociationInput: [bulkAssociationAttachmentWithBook_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;