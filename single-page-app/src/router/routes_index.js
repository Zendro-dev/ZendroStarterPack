import BreedingPoolRoutes from './BreedingPoolRoutes'
import FieldPlotRoutes from './FieldPlotRoutes'
import GenotypeRoutes from './GenotypeRoutes'
import IndividualRoutes from './IndividualRoutes'
import MarkerDataRoutes from './MarkerDataRoutes'
import MeasurementRoutes from './MeasurementRoutes'
import NucAcidLibraryResultRoutes from './NucAcidLibraryResultRoutes'
import RoleRoutes from './RoleRoutes'
import SampleRoutes from './SampleRoutes'
import SequencingExperimentRoutes from './SequencingExperimentRoutes'
import TranscriptCountRoutes from './TranscriptCountRoutes'
import UserRoutes from './UserRoutes'

let child_paths = []

      child_paths.push(...BreedingPoolRoutes)
      child_paths.push(...FieldPlotRoutes)
      child_paths.push(...GenotypeRoutes)
      child_paths.push(...IndividualRoutes)
      child_paths.push(...MarkerDataRoutes)
      child_paths.push(...MeasurementRoutes)
      child_paths.push(...NucAcidLibraryResultRoutes)
      child_paths.push(...RoleRoutes)
      child_paths.push(...SampleRoutes)
      child_paths.push(...SequencingExperimentRoutes)
      child_paths.push(...TranscriptCountRoutes)
      child_paths.push(...UserRoutes)
  
export default child_paths
