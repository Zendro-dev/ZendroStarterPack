import users from '@/components/users'
import userCreate from '@/components/userCreateForm'
import userEdit from '@/components/userEditForm'
import userUploadCsv from '@/components/userUploadCsvForm'

export default [
    {
      path: '/users',
      name: 'users',
      component: users,
    },
    {
      path: '/user/:id',
      name: 'userEdit',
      component: userEdit,
    },
    {
      path: '/user',
      name: 'userCreate',
      component: userCreate,
    },
    {
      path: '/users/upload_csv',
      name: 'userUploadCsv',
      component: userUploadCsv
    }
  ]
