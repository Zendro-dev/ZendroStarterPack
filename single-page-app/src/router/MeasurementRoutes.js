import measurements from '@/components/measurements'
import MeasurementCreate from '@/components/MeasurementCreateForm'
import MeasurementEdit from '@/components/MeasurementEditForm'
import MeasurementUploadCsv from '@/components/MeasurementUploadCsvForm'

export default [
    {
      path: '/measurements',
      name: 'measurements',
      component: measurements,
    },
    {
      path: '/measurement/:id',
      name: 'MeasurementEdit',
      component: MeasurementEdit,
    },
    {
      path: '/measurement',
      name: 'MeasurementCreate',
      component: MeasurementCreate,
    },
    {
      path: '/measurements/upload_csv',
      name: 'MeasurementUploadCsv',
      component: MeasurementUploadCsv
    }
  ]
