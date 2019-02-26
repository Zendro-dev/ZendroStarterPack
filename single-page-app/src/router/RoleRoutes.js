import roles from '@/components/roles'
import RoleCreate from '@/components/RoleCreateForm'
import RoleEdit from '@/components/RoleEditForm'
import RoleUploadCsv from '@/components/RoleUploadCsvForm'

export default [
    {
      path: '/roles',
      name: 'roles',
      component: roles,
    },
    {
      path: '/role/:id',
      name: 'RoleEdit',
      component: RoleEdit,
    },
    {
      path: '/role',
      name: 'RoleCreate',
      component: RoleCreate,
    },
    {
      path: '/roles/upload_csv',
      name: 'RoleUploadCsv',
      component: RoleUploadCsv
    }
  ]
