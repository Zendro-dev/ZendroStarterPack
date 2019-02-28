import nuc_acid_library_results from '@/components/nuc_acid_library_results'
import nuc_acid_library_resultCreate from '@/components/nuc_acid_library_resultCreateForm'
import nuc_acid_library_resultEdit from '@/components/nuc_acid_library_resultEditForm'
import nuc_acid_library_resultUploadCsv from '@/components/nuc_acid_library_resultUploadCsvForm'

export default [
    {
      path: '/nuc_acid_library_results',
      name: 'nuc_acid_library_results',
      component: nuc_acid_library_results,
    },
    {
      path: '/nuc_acid_library_result/:id',
      name: 'nuc_acid_library_resultEdit',
      component: nuc_acid_library_resultEdit,
    },
    {
      path: '/nuc_acid_library_result',
      name: 'nuc_acid_library_resultCreate',
      component: nuc_acid_library_resultCreate,
    },
    {
      path: '/nuc_acid_library_results/upload_csv',
      name: 'nuc_acid_library_resultUploadCsv',
      component: nuc_acid_library_resultUploadCsv
    }
  ]
