import sequencingexperiments from '@/components/sequencingexperiments'
import SequencingExperimentCreate from '@/components/SequencingExperimentCreateForm'
import SequencingExperimentEdit from '@/components/SequencingExperimentEditForm'
import SequencingExperimentUploadCsv from '@/components/SequencingExperimentUploadCsvForm'

export default [
    {
      path: '/sequencingexperiments',
      name: 'sequencingexperiments',
      component: sequencingexperiments,
    },
    {
      path: '/sequencingexperiment/:id',
      name: 'SequencingExperimentEdit',
      component: SequencingExperimentEdit,
    },
    {
      path: '/sequencingexperiment',
      name: 'SequencingExperimentCreate',
      component: SequencingExperimentCreate,
    },
    {
      path: '/sequencingexperiments/upload_csv',
      name: 'SequencingExperimentUploadCsv',
      component: SequencingExperimentUploadCsv
    }
  ]
