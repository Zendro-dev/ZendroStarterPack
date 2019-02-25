import markerdata from '@/components/markerdata'
import MarkerDataCreate from '@/components/MarkerDataCreateForm'
import MarkerDataEdit from '@/components/MarkerDataEditForm'
import MarkerDataUploadCsv from '@/components/MarkerDataUploadCsvForm'

export default [
    {
      path: '/markerdata',
      name: 'markerdata',
      component: markerdata,
    },
    {
      path: '/markerdata/:id',
      name: 'MarkerDataEdit',
      component: MarkerDataEdit,
    },
    {
      path: '/markerdata',
      name: 'MarkerDataCreate',
      component: MarkerDataCreate,
    },
    {
      path: '/markerdata/upload_csv',
      name: 'MarkerDataUploadCsv',
      component: MarkerDataUploadCsv
    }
  ]
