module.exports = `
  type nuc_acid_library_result  {
    id: ID
    lab_code: String
    file_name: String
    file_uri: String
    type: String
    insert_size: Float
    technical_replicate: Int
    trimmed: Boolean
    sample: sample
    }

  type VueTableNuc_acid_library_result{
    data : [nuc_acid_library_result]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum nuc_acid_library_resultField {
    id 
    lab_code  
    file_name  
    file_uri  
    type  
    insert_size  
    technical_replicate  
    trimmed  
  }

  input searchNuc_acid_library_resultInput {
    field: nuc_acid_library_resultField
    value: typeValue
    operator: Operator
    search: [searchNuc_acid_library_resultInput]
  }

  input orderNuc_acid_library_resultInput{
    field: nuc_acid_library_resultField
    order: Order
  }

  type Query {
    nuc_acid_library_results(search: searchNuc_acid_library_resultInput, order: [ orderNuc_acid_library_resultInput ], pagination: paginationInput ): [nuc_acid_library_result]
    readOneNuc_acid_library_result(id: ID!): nuc_acid_library_result
    countNuc_acid_library_results(search: searchNuc_acid_library_resultInput ): Int
    vueTableNuc_acid_library_result : VueTableNuc_acid_library_result  }

    type Mutation {
    addNuc_acid_library_result( lab_code: String, file_name: String, file_uri: String, type: String, insert_size: Float, technical_replicate: Int, trimmed: Boolean, sample_id: Int   ): nuc_acid_library_result!
    deleteNuc_acid_library_result(id: ID!): String!
    updateNuc_acid_library_result(id: ID!, lab_code: String, file_name: String, file_uri: String, type: String, insert_size: Float, technical_replicate: Int, trimmed: Boolean, sample_id: Int  ): nuc_acid_library_result!
    bulkAddNuc_acid_library_resultXlsx: [nuc_acid_library_result]
    bulkAddNuc_acid_library_resultCsv: [nuc_acid_library_result]
}
  `;