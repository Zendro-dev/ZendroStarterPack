import BeedingPoolRoutes from './BeedingPoolRoutes'
import FieldPlotRoutes from './FieldPlotRoutes'
import GenotypeRoutes from './GenotypeRoutes'
import IndividualRoutes from './IndividualRoutes'
import MarkerDataRoutes from './MarkerDataRoutes'
import MeasurementRoutes from './MeasurementRoutes'
import NucAcidLibraryResultRoutes from './NucAcidLibraryResultRoutes'
import SampleRoutes from './SampleRoutes'
import SequencingExperimentRoutes from './SequencingExperimentRoutes'
import TranscriptCountRoutes from './TranscriptCountRoutes'

let child_paths = []

      child_paths.push(...BeedingPoolRoutes)
      child_paths.push(...FieldPlotRoutes)
      child_paths.push(...GenotypeRoutes)
      child_paths.push(...IndividualRoutes)
      child_paths.push(...MarkerDataRoutes)
      child_paths.push(...MeasurementRoutes)
      child_paths.push(...NucAcidLibraryResultRoutes)
      child_paths.push(...SampleRoutes)
      child_paths.push(...SequencingExperimentRoutes)
      child_paths.push(...TranscriptCountRoutes)
  
export default child_paths
