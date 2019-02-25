import individuals from '@/components/individuals'
import IndividualCreate from '@/components/IndividualCreateForm'
import IndividualEdit from '@/components/IndividualEditForm'
import IndividualUploadCsv from '@/components/IndividualUploadCsvForm'

export default [
    {
      path: '/individuals',
      name: 'individuals',
      component: individuals,
    },
    {
      path: '/individual/:id',
      name: 'IndividualEdit',
      component: IndividualEdit,
    },
    {
      path: '/individual',
      name: 'IndividualCreate',
      component: IndividualCreate,
    },
    {
      path: '/individuals/upload_csv',
      name: 'IndividualUploadCsv',
      component: IndividualUploadCsv
    }
  ]
