import transcriptcounts from '@/components/transcriptcounts'
import TranscriptCountCreate from '@/components/TranscriptCountCreateForm'
import TranscriptCountEdit from '@/components/TranscriptCountEditForm'
import TranscriptCountUploadCsv from '@/components/TranscriptCountUploadCsvForm'

export default [
    {
      path: '/transcriptcounts',
      name: 'transcriptcounts',
      component: transcriptcounts,
    },
    {
      path: '/transcriptcount/:id',
      name: 'TranscriptCountEdit',
      component: TranscriptCountEdit,
    },
    {
      path: '/transcriptcount',
      name: 'TranscriptCountCreate',
      component: TranscriptCountCreate,
    },
    {
      path: '/transcriptcounts/upload_csv',
      name: 'TranscriptCountUploadCsv',
      component: TranscriptCountUploadCsv
    }
  ]
