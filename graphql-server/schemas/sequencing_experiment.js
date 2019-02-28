module.exports = `
  type sequencing_experiment  {
    id: ID
    name: String
    description: String
    start_date: String
    end_date: String
    protocol: String
    platform: String
    data_type: String
    library_type: String
    library_preparation: String
    aimed_coverage: Float
    resulting_coverage: Float
    insert_size: Float
    aimed_read_length: String
    genome_complexity_reduction: String
    contamination: String
      nuc_acid_library_resultsFilter(search: searchNuc_acid_library_resultInput, order: [ orderNuc_acid_library_resultInput ], pagination: paginationInput): [nuc_acid_library_result]
    countFilteredNuc_acid_library_results(search: searchNuc_acid_library_resultInput) : Int
  samplesFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput): [sample]
    countFilteredSamples(search: searchSampleInput) : Int
  }

  type VueTableSequencing_experiment{
    data : [sequencing_experiment]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum sequencing_experimentField {
    id 
    name  
    description  
    start_date  
    end_date  
    protocol  
    platform  
    data_type  
    library_type  
    library_preparation  
    aimed_coverage  
    resulting_coverage  
    insert_size  
    aimed_read_length  
    genome_complexity_reduction  
    contamination  
  }

  input searchSequencing_experimentInput {
    field: sequencing_experimentField
    value: typeValue
    operator: Operator
    search: [searchSequencing_experimentInput]
  }

  input orderSequencing_experimentInput{
    field: sequencing_experimentField
    order: Order
  }

  type Query {
    sequencing_experiments(search: searchSequencing_experimentInput, order: [ orderSequencing_experimentInput ], pagination: paginationInput ): [sequencing_experiment]
    readOneSequencing_experiment(id: ID!): sequencing_experiment
    countSequencing_experiments(search: searchSequencing_experimentInput ): Int
    vueTableSequencing_experiment : VueTableSequencing_experiment  }

    type Mutation {
    addSequencing_experiment( name: String, description: String, start_date: String, end_date: String, protocol: String, platform: String, data_type: String, library_type: String, library_preparation: String, aimed_coverage: Float, resulting_coverage: Float, insert_size: Float, aimed_read_length: String, genome_complexity_reduction: String, contamination: String , addNuc_acid_library_results:[ID], addSamples:[ID] ): sequencing_experiment!
    deleteSequencing_experiment(id: ID!): String!
    updateSequencing_experiment(id: ID!, name: String, description: String, start_date: String, end_date: String, protocol: String, platform: String, data_type: String, library_type: String, library_preparation: String, aimed_coverage: Float, resulting_coverage: Float, insert_size: Float, aimed_read_length: String, genome_complexity_reduction: String, contamination: String , addNuc_acid_library_results:[ID], removeNuc_acid_library_results:[ID] , addSamples:[ID], removeSamples:[ID] ): sequencing_experiment!
    bulkAddSequencing_experimentXlsx: [sequencing_experiment]
    bulkAddSequencing_experimentCsv: [sequencing_experiment]
}
  `;