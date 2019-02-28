module.exports = `
  type marker_data  {
    id: ID
    marker_name: String
    nucleotide: String
    individual: individual
    }

  type VueTableMarker_data{
    data : [marker_data]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum marker_dataField {
    id 
    marker_name  
    nucleotide  
  }

  input searchMarker_dataInput {
    field: marker_dataField
    value: typeValue
    operator: Operator
    search: [searchMarker_dataInput]
  }

  input orderMarker_dataInput{
    field: marker_dataField
    order: Order
  }

  type Query {
    marker_data(search: searchMarker_dataInput, order: [ orderMarker_dataInput ], pagination: paginationInput ): [marker_data]
    readOneMarker_data(id: ID!): marker_data
    countMarker_data(search: searchMarker_dataInput ): Int
    vueTableMarker_data : VueTableMarker_data  }

    type Mutation {
    addMarker_data( marker_name: String, nucleotide: String, individual_id: Int   ): marker_data!
    deleteMarker_data(id: ID!): String!
    updateMarker_data(id: ID!, marker_name: String, nucleotide: String, individual_id: Int  ): marker_data!
    bulkAddMarker_dataXlsx: [marker_data]
    bulkAddMarker_dataCsv: [marker_data]
}
  `;