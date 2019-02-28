module.exports = `
  type individual  {
    id: ID
    name: String
    description: String
    genotype: genotype
    marker_data_snpsFilter(search: searchMarker_dataInput, order: [ orderMarker_dataInput ], pagination: paginationInput): [marker_data]
    countFilteredMarker_data(search: searchMarker_dataInput) : Int
  }

  type VueTableIndividual{
    data : [individual]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum individualField {
    id 
    name  
    description  
  }

  input searchIndividualInput {
    field: individualField
    value: typeValue
    operator: Operator
    search: [searchIndividualInput]
  }

  input orderIndividualInput{
    field: individualField
    order: Order
  }

  type Query {
    individuals(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationInput ): [individual]
    readOneIndividual(id: ID!): individual
    countIndividuals(search: searchIndividualInput ): Int
    vueTableIndividual : VueTableIndividual  }

    type Mutation {
    addIndividual( name: String, description: String, genotype_id: Int  , addMarker_data:[ID] ): individual!
    deleteIndividual(id: ID!): String!
    updateIndividual(id: ID!, name: String, description: String, genotype_id: Int  , addMarker_data:[ID], removeMarker_data:[ID] ): individual!
    bulkAddIndividualXlsx: [individual]
    bulkAddIndividualCsv: [individual]
}
  `;