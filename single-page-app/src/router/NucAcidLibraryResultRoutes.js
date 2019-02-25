import nucacidlibraryresults from '@/components/nucacidlibraryresults'
import NucAcidLibraryResultCreate from '@/components/NucAcidLibraryResultCreateForm'
import NucAcidLibraryResultEdit from '@/components/NucAcidLibraryResultEditForm'
import NucAcidLibraryResultUploadCsv from '@/components/NucAcidLibraryResultUploadCsvForm'

export default [
    {
      path: '/nucacidlibraryresults',
      name: 'nucacidlibraryresults',
      component: nucacidlibraryresults,
    },
    {
      path: '/nucacidlibraryresult/:id',
      name: 'NucAcidLibraryResultEdit',
      component: NucAcidLibraryResultEdit,
    },
    {
      path: '/nucacidlibraryresult',
      name: 'NucAcidLibraryResultCreate',
      component: NucAcidLibraryResultCreate,
    },
    {
      path: '/nucacidlibraryresults/upload_csv',
      name: 'NucAcidLibraryResultUploadCsv',
      component: NucAcidLibraryResultUploadCsv
    }
  ]
