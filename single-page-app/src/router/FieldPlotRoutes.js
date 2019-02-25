import fieldplots from '@/components/fieldplots'
import FieldPlotCreate from '@/components/FieldPlotCreateForm'
import FieldPlotEdit from '@/components/FieldPlotEditForm'
import FieldPlotUploadCsv from '@/components/FieldPlotUploadCsvForm'

export default [
    {
      path: '/fieldplots',
      name: 'fieldplots',
      component: fieldplots,
    },
    {
      path: '/fieldplot/:id',
      name: 'FieldPlotEdit',
      component: FieldPlotEdit,
    },
    {
      path: '/fieldplot',
      name: 'FieldPlotCreate',
      component: FieldPlotCreate,
    },
    {
      path: '/fieldplots/upload_csv',
      name: 'FieldPlotUploadCsv',
      component: FieldPlotUploadCsv
    }
  ]
