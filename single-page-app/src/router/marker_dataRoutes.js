import marker_data from '@/components/marker_data'
import marker_dataCreate from '@/components/marker_dataCreateForm'
import marker_dataEdit from '@/components/marker_dataEditForm'
import marker_dataUploadCsv from '@/components/marker_dataUploadCsvForm'

export default [
    {
      path: '/marker_data',
      name: 'marker_data',
      component: marker_data,
    },
    {
      path: '/marker_data/:id',
      name: 'marker_dataEdit',
      component: marker_dataEdit,
    },
    {
      path: '/marker_data',
      name: 'marker_dataCreate',
      component: marker_dataCreate,
    },
    {
      path: '/marker_data/upload_csv',
      name: 'marker_dataUploadCsv',
      component: marker_dataUploadCsv
    }
  ]
