import genotypes from '@/components/genotypes'
import genotypeCreate from '@/components/genotypeCreateForm'
import genotypeEdit from '@/components/genotypeEditForm'
import genotypeUploadCsv from '@/components/genotypeUploadCsvForm'

export default [
    {
      path: '/genotypes',
      name: 'genotypes',
      component: genotypes,
    },
    {
      path: '/genotype/:id',
      name: 'genotypeEdit',
      component: genotypeEdit,
    },
    {
      path: '/genotype',
      name: 'genotypeCreate',
      component: genotypeCreate,
    },
    {
      path: '/genotypes/upload_csv',
      name: 'genotypeUploadCsv',
      component: genotypeUploadCsv
    }
  ]
