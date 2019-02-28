module.exports = `
  type genotype  {
    id: ID
    name: String
    description: String
    pedigree_type: String
    mother: individual
  father: individual
  breeding_pool: breeding_pool
    }

  type VueTableGenotype{
    data : [genotype]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum genotypeField {
    id 
    name  
    description  
    pedigree_type  
  }

  input searchGenotypeInput {
    field: genotypeField
    value: typeValue
    operator: Operator
    search: [searchGenotypeInput]
  }

  input orderGenotypeInput{
    field: genotypeField
    order: Order
  }

  type Query {
    genotypes(search: searchGenotypeInput, order: [ orderGenotypeInput ], pagination: paginationInput ): [genotype]
    readOneGenotype(id: ID!): genotype
    countGenotypes(search: searchGenotypeInput ): Int
    vueTableGenotype : VueTableGenotype  }

    type Mutation {
    addGenotype( name: String, description: String, pedigree_type: String, mother_id: Int, father_id: Int, breeding_pool_id: Int   ): genotype!
    deleteGenotype(id: ID!): String!
    updateGenotype(id: ID!, name: String, description: String, pedigree_type: String, mother_id: Int, father_id: Int, breeding_pool_id: Int  ): genotype!
    bulkAddGenotypeXlsx: [genotype]
    bulkAddGenotypeCsv: [genotype]
}
  `;