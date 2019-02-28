import breeding_pools from '@/components/breeding_pools'
import breeding_poolCreate from '@/components/breeding_poolCreateForm'
import breeding_poolEdit from '@/components/breeding_poolEditForm'
import breeding_poolUploadCsv from '@/components/breeding_poolUploadCsvForm'

export default [
    {
      path: '/breeding_pools',
      name: 'breeding_pools',
      component: breeding_pools,
    },
    {
      path: '/breeding_pool/:id',
      name: 'breeding_poolEdit',
      component: breeding_poolEdit,
    },
    {
      path: '/breeding_pool',
      name: 'breeding_poolCreate',
      component: breeding_poolCreate,
    },
    {
      path: '/breeding_pools/upload_csv',
      name: 'breeding_poolUploadCsv',
      component: breeding_poolUploadCsv
    }
  ]
