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
  }
  input searchAttachmentInput {
    field: attachmentField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchAttachmentInput]
  }

  input orderAttachmentInput{
    field: attachmentField
    order: Order
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

    addAttachment(id: ID!,file: Upload ,fileName: String!, fileURL: String, mimeType: String, fileSize: Int, identifierName: String    , skipAssociationsExistenceChecks:Boolean = false): attachment!
    updateAttachment(id: ID!, fileName: String, fileURL: String, mimeType: String, fileSize: Int, identifierName: String    , skipAssociationsExistenceChecks:Boolean = false): attachment!
    deleteAttachment(id: ID!): String!
    bulkAddAttachmentCsv: String!
      }
`;