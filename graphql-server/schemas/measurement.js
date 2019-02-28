module.exports = `
  type measurement  {
    id: ID
    method: String
    reference: String
    float_value: Float
    int_value: Int
    text_value: String
    unit: String
    field_plot: field_plot
    }

  type VueTableMeasurement{
    data : [measurement]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum measurementField {
    id 
    method  
    reference  
    float_value  
    int_value  
    text_value  
    unit  
  }

  input searchMeasurementInput {
    field: measurementField
    value: typeValue
    operator: Operator
    search: [searchMeasurementInput]
  }

  input orderMeasurementInput{
    field: measurementField
    order: Order
  }

  type Query {
    measurements(search: searchMeasurementInput, order: [ orderMeasurementInput ], pagination: paginationInput ): [measurement]
    readOneMeasurement(id: ID!): measurement
    countMeasurements(search: searchMeasurementInput ): Int
    vueTableMeasurement : VueTableMeasurement  }

    type Mutation {
    addMeasurement( method: String, reference: String, float_value: Float, int_value: Int, text_value: String, unit: String, field_plot_id: Int   ): measurement!
    deleteMeasurement(id: ID!): String!
    updateMeasurement(id: ID!, method: String, reference: String, float_value: Float, int_value: Int, text_value: String, unit: String, field_plot_id: Int  ): measurement!
    bulkAddMeasurementXlsx: [measurement]
    bulkAddMeasurementCsv: [measurement]
}
  `;