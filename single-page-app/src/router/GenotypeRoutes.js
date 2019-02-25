import genotypes from '@/components/genotypes'
import GenotypeCreate from '@/components/GenotypeCreateForm'
import GenotypeEdit from '@/components/GenotypeEditForm'
import GenotypeUploadCsv from '@/components/GenotypeUploadCsvForm'

export default [
    {
      path: '/genotypes',
      name: 'genotypes',
      component: genotypes,
    },
    {
      path: '/genotype/:id',
      name: 'GenotypeEdit',
      component: GenotypeEdit,
    },
    {
      path: '/genotype',
      name: 'GenotypeCreate',
      component: GenotypeCreate,
    },
    {
      path: '/genotypes/upload_csv',
      name: 'GenotypeUploadCsv',
      component: GenotypeUploadCsv
    }
  ]
