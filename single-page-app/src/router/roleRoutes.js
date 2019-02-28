import roles from '@/components/roles'
import roleCreate from '@/components/roleCreateForm'
import roleEdit from '@/components/roleEditForm'
import roleUploadCsv from '@/components/roleUploadCsvForm'

export default [
    {
      path: '/roles',
      name: 'roles',
      component: roles,
    },
    {
      path: '/role/:id',
      name: 'roleEdit',
      component: roleEdit,
    },
    {
      path: '/role',
      name: 'roleCreate',
      component: roleCreate,
    },
    {
      path: '/roles/upload_csv',
      name: 'roleUploadCsv',
      component: roleUploadCsv
    }
  ]
