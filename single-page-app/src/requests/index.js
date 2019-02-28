import breeding_poolQueries from './breeding_pool'
import field_plotQueries from './field_plot'
import genotypeQueries from './genotype'
import individualQueries from './individual'
import marker_dataQueries from './marker_data'
import measurementQueries from './measurement'
import nuc_acid_library_resultQueries from './nuc_acid_library_result'
import roleQueries from './role'
import sampleQueries from './sample'
import sequencing_experimentQueries from './sequencing_experiment'
import transcript_countQueries from './transcript_count'
import userQueries from './user'

export default {

    Breeding_pool : breeding_poolQueries,
    Field_plot : field_plotQueries,
    Genotype : genotypeQueries,
    Individual : individualQueries,
    Marker_data : marker_dataQueries,
    Measurement : measurementQueries,
    Nuc_acid_library_result : nuc_acid_library_resultQueries,
    Role : roleQueries,
    Sample : sampleQueries,
    Sequencing_experiment : sequencing_experimentQueries,
    Transcript_count : transcript_countQueries,
    User : userQueries,
  
}
