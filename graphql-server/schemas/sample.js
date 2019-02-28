module.exports = `
  type sample  {
    id: ID
    name: String
    sampling_date: String
    type: String
    biological_replicate_no: Int
    lab_code: String
    treatment: String
    tissue: String
    individual: individual
  sequencing_experiment: sequencing_experiment
    library_dataFilter(search: searchNuc_acid_library_resultInput, order: [ orderNuc_acid_library_resultInput ], pagination: paginationInput): [nuc_acid_library_result]
    countFilteredNuc_acid_library_results(search: searchNuc_acid_library_resultInput) : Int
  }

  type VueTableSample{
    data : [sample]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum sampleField {
    id 
    name  
    sampling_date  
    type  
    biological_replicate_no  
    lab_code  
    treatment  
    tissue  
  }

  input searchSampleInput {
    field: sampleField
    value: typeValue
    operator: Operator
    search: [searchSampleInput]
  }

  input orderSampleInput{
    field: sampleField
    order: Order
  }

  type Query {
    samples(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput ): [sample]
    readOneSample(id: ID!): sample
    countSamples(search: searchSampleInput ): Int
    vueTableSample : VueTableSample  }

    type Mutation {
    addSample( name: String, sampling_date: String, type: String, biological_replicate_no: Int, lab_code: String, treatment: String, tissue: String, individual_id: Int, sequencing_experiment_id: Int  , addNuc_acid_library_results:[ID] ): sample!
    deleteSample(id: ID!): String!
    updateSample(id: ID!, name: String, sampling_date: String, type: String, biological_replicate_no: Int, lab_code: String, treatment: String, tissue: String, individual_id: Int, sequencing_experiment_id: Int  , addNuc_acid_library_results:[ID], removeNuc_acid_library_results:[ID] ): sample!
    bulkAddSampleXlsx: [sample]
    bulkAddSampleCsv: [sample]
}
  `;