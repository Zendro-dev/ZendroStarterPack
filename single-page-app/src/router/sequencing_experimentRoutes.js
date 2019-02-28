import sequencing_experiments from '@/components/sequencing_experiments'
import sequencing_experimentCreate from '@/components/sequencing_experimentCreateForm'
import sequencing_experimentEdit from '@/components/sequencing_experimentEditForm'
import sequencing_experimentUploadCsv from '@/components/sequencing_experimentUploadCsvForm'

export default [
    {
      path: '/sequencing_experiments',
      name: 'sequencing_experiments',
      component: sequencing_experiments,
    },
    {
      path: '/sequencing_experiment/:id',
      name: 'sequencing_experimentEdit',
      component: sequencing_experimentEdit,
    },
    {
      path: '/sequencing_experiment',
      name: 'sequencing_experimentCreate',
      component: sequencing_experimentCreate,
    },
    {
      path: '/sequencing_experiments/upload_csv',
      name: 'sequencing_experimentUploadCsv',
      component: sequencing_experimentUploadCsv
    }
  ]
