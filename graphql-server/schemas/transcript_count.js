module.exports = `
  type transcript_count  {
    id: ID
    gene: String
    value: Float
    method: String
    reference_genome: String
    sample: sample
    }

  type VueTableTranscript_count{
    data : [transcript_count]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum transcript_countField {
    id 
    gene  
    value  
    method  
    reference_genome  
  }

  input searchTranscript_countInput {
    field: transcript_countField
    value: typeValue
    operator: Operator
    search: [searchTranscript_countInput]
  }

  input orderTranscript_countInput{
    field: transcript_countField
    order: Order
  }

  type Query {
    transcript_counts(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationInput ): [transcript_count]
    readOneTranscript_count(id: ID!): transcript_count
    countTranscript_counts(search: searchTranscript_countInput ): Int
    vueTableTranscript_count : VueTableTranscript_count  }

    type Mutation {
    addTranscript_count( gene: String, value: Float, method: String, reference_genome: String, sample_id: Int   ): transcript_count!
    deleteTranscript_count(id: ID!): String!
    updateTranscript_count(id: ID!, gene: String, value: Float, method: String, reference_genome: String, sample_id: Int  ): transcript_count!
    bulkAddTranscript_countXlsx: [transcript_count]
    bulkAddTranscript_countCsv: [transcript_count]
}
  `;