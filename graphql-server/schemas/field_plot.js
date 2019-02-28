module.exports = `
  type field_plot  {
    id: ID
    field_name: String
    coordinates_or_name: String
    year: String
    area_sqm: Float
    type: String
    genotype: genotype
    }

  type VueTableField_plot{
    data : [field_plot]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum field_plotField {
    id 
    field_name  
    coordinates_or_name  
    year  
    area_sqm  
    type  
  }

  input searchField_plotInput {
    field: field_plotField
    value: typeValue
    operator: Operator
    search: [searchField_plotInput]
  }

  input orderField_plotInput{
    field: field_plotField
    order: Order
  }

  type Query {
    field_plots(search: searchField_plotInput, order: [ orderField_plotInput ], pagination: paginationInput ): [field_plot]
    readOneField_plot(id: ID!): field_plot
    countField_plots(search: searchField_plotInput ): Int
    vueTableField_plot : VueTableField_plot  }

    type Mutation {
    addField_plot( field_name: String, coordinates_or_name: String, year: String, area_sqm: Float, type: String, genotype_id: Int   ): field_plot!
    deleteField_plot(id: ID!): String!
    updateField_plot(id: ID!, field_name: String, coordinates_or_name: String, year: String, area_sqm: Float, type: String, genotype_id: Int  ): field_plot!
    bulkAddField_plotXlsx: [field_plot]
    bulkAddField_plotCsv: [field_plot]
}
  `;