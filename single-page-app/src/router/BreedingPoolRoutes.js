import breedingpools from '@/components/breedingpools'
import BreedingPoolCreate from '@/components/BreedingPoolCreateForm'
import BreedingPoolEdit from '@/components/BreedingPoolEditForm'
import BreedingPoolUploadCsv from '@/components/BreedingPoolUploadCsvForm'

export default [
    {
      path: '/breedingpools',
      name: 'breedingpools',
      component: breedingpools,
    },
    {
      path: '/breedingpool/:id',
      name: 'BreedingPoolEdit',
      component: BreedingPoolEdit,
    },
    {
      path: '/breedingpool',
      name: 'BreedingPoolCreate',
      component: BreedingPoolCreate,
    },
    {
      path: '/breedingpools/upload_csv',
      name: 'BreedingPoolUploadCsv',
      component: BreedingPoolUploadCsv
    }
  ]
