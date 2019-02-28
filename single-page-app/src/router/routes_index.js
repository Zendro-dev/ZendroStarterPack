import breeding_poolRoutes from './breeding_poolRoutes'
import field_plotRoutes from './field_plotRoutes'
import genotypeRoutes from './genotypeRoutes'
import individualRoutes from './individualRoutes'
import marker_dataRoutes from './marker_dataRoutes'
import measurementRoutes from './measurementRoutes'
import nuc_acid_library_resultRoutes from './nuc_acid_library_resultRoutes'
import roleRoutes from './roleRoutes'
import sampleRoutes from './sampleRoutes'
import sequencing_experimentRoutes from './sequencing_experimentRoutes'
import transcript_countRoutes from './transcript_countRoutes'
import userRoutes from './userRoutes'

let child_paths = []

      child_paths.push(...breeding_poolRoutes)
      child_paths.push(...field_plotRoutes)
      child_paths.push(...genotypeRoutes)
      child_paths.push(...individualRoutes)
      child_paths.push(...marker_dataRoutes)
      child_paths.push(...measurementRoutes)
      child_paths.push(...nuc_acid_library_resultRoutes)
      child_paths.push(...roleRoutes)
      child_paths.push(...sampleRoutes)
      child_paths.push(...sequencing_experimentRoutes)
      child_paths.push(...transcript_countRoutes)
      child_paths.push(...userRoutes)
  
export default child_paths
