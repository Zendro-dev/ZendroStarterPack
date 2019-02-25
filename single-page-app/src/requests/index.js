import beedingpoolQueries from './beedingpool'
import fieldplotQueries from './fieldplot'
import genotypeQueries from './genotype'
import individualQueries from './individual'
import markerdataQueries from './markerdata'
import measurementQueries from './measurement'
import nucacidlibraryresultQueries from './nucacidlibraryresult'
import sampleQueries from './sample'
import sequencingexperimentQueries from './sequencingexperiment'
import transcriptcountQueries from './transcriptcount'

export default {

    Beedingpool : beedingpoolQueries,
    Fieldplot : fieldplotQueries,
    Genotype : genotypeQueries,
    Individual : individualQueries,
    Markerdata : markerdataQueries,
    Measurement : measurementQueries,
    Nucacidlibraryresult : nucacidlibraryresultQueries,
    Sample : sampleQueries,
    Sequencingexperiment : sequencingexperimentQueries,
    Transcriptcount : transcriptcountQueries,
  
}
