module.exports = `
  type breeding_pool  {
    id: ID
    name: String
    description: String
      genotypesFilter(search: searchGenotypeInput, order: [ orderGenotypeInput ], pagination: paginationInput): [genotype]
    countFilteredGenotypes(search: searchGenotypeInput) : Int
  }

  type VueTableBreeding_pool{
    data : [breeding_pool]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum breeding_poolField {
    id 
    name  
    description  
  }

  input searchBreeding_poolInput {
    field: breeding_poolField
    value: typeValue
    operator: Operator
    search: [searchBreeding_poolInput]
  }

  input orderBreeding_poolInput{
    field: breeding_poolField
    order: Order
  }

  type Query {
    breeding_pools(search: searchBreeding_poolInput, order: [ orderBreeding_poolInput ], pagination: paginationInput ): [breeding_pool]
    readOneBreeding_pool(id: ID!): breeding_pool
    countBreeding_pools(search: searchBreeding_poolInput ): Int
    vueTableBreeding_pool : VueTableBreeding_pool  }

    type Mutation {
    addBreeding_pool( name: String, description: String , addGenotypes:[ID] ): breeding_pool!
    deleteBreeding_pool(id: ID!): String!
    updateBreeding_pool(id: ID!, name: String, description: String , addGenotypes:[ID], removeGenotypes:[ID] ): breeding_pool!
    bulkAddBreeding_poolXlsx: [breeding_pool]
    bulkAddBreeding_poolCsv: [breeding_pool]
}
  `;