import samples from '@/components/samples'
import SampleCreate from '@/components/SampleCreateForm'
import SampleEdit from '@/components/SampleEditForm'
import SampleUploadCsv from '@/components/SampleUploadCsvForm'

export default [
    {
      path: '/samples',
      name: 'samples',
      component: samples,
    },
    {
      path: '/sample/:id',
      name: 'SampleEdit',
      component: SampleEdit,
    },
    {
      path: '/sample',
      name: 'SampleCreate',
      component: SampleCreate,
    },
    {
      path: '/samples/upload_csv',
      name: 'SampleUploadCsv',
      component: SampleUploadCsv
    }
  ]
