import beedingpools from '@/components/beedingpools'
import BeedingPoolCreate from '@/components/BeedingPoolCreateForm'
import BeedingPoolEdit from '@/components/BeedingPoolEditForm'
import BeedingPoolUploadCsv from '@/components/BeedingPoolUploadCsvForm'

export default [
    {
      path: '/beedingpools',
      name: 'beedingpools',
      component: beedingpools,
    },
    {
      path: '/beedingpool/:id',
      name: 'BeedingPoolEdit',
      component: BeedingPoolEdit,
    },
    {
      path: '/beedingpool',
      name: 'BeedingPoolCreate',
      component: BeedingPoolCreate,
    },
    {
      path: '/beedingpools/upload_csv',
      name: 'BeedingPoolUploadCsv',
      component: BeedingPoolUploadCsv
    }
  ]
