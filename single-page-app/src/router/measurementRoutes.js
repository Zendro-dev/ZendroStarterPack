import measurements from '@/components/measurements'
import measurementCreate from '@/components/measurementCreateForm'
import measurementEdit from '@/components/measurementEditForm'
import measurementUploadCsv from '@/components/measurementUploadCsvForm'

export default [
    {
      path: '/measurements',
      name: 'measurements',
      component: measurements,
    },
    {
      path: '/measurement/:id',
      name: 'measurementEdit',
      component: measurementEdit,
    },
    {
      path: '/measurement',
      name: 'measurementCreate',
      component: measurementCreate,
    },
    {
      path: '/measurements/upload_csv',
      name: 'measurementUploadCsv',
      component: measurementUploadCsv
    }
  ]
