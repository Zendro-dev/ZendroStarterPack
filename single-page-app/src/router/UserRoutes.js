import users from '@/components/users'
import UserCreate from '@/components/UserCreateForm'
import UserEdit from '@/components/UserEditForm'
import UserUploadCsv from '@/components/UserUploadCsvForm'

export default [
    {
      path: '/users',
      name: 'users',
      component: users,
    },
    {
      path: '/user/:id',
      name: 'UserEdit',
      component: UserEdit,
    },
    {
      path: '/user',
      name: 'UserCreate',
      component: UserCreate,
    },
    {
      path: '/users/upload_csv',
      name: 'UserUploadCsv',
      component: UserUploadCsv
    }
  ]
