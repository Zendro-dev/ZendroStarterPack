import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addSequencingexperiment(
   $name:String  $description:String  $start_date:String  $end_date:String  $protocol:String  $platform:String  $data_type:String  $library_type:String  $library_preparation:String  $aimed_coverage:Float  $resulting_coverage:Float  $insert_size:Float  $aimed_read_length:String  $genome_complexity_reduction:String  $contamination:String      $addNucacidlibraryresults:[ID] $addSamples:[ID]  ){
    addSequencingexperiment(
     name:$name   description:$description   start_date:$start_date   end_date:$end_date   protocol:$protocol   platform:$platform   data_type:$data_type   library_type:$library_type   library_preparation:$library_preparation   aimed_coverage:$aimed_coverage   resulting_coverage:$resulting_coverage   insert_size:$insert_size   aimed_read_length:$aimed_read_length   genome_complexity_reduction:$genome_complexity_reduction   contamination:$contamination           addNucacidlibraryresults:$addNucacidlibraryresults  addSamples:$addSamples     ){id  name   description   start_date   end_date   protocol   platform   data_type   library_type   library_preparation   aimed_coverage   resulting_coverage   insert_size   aimed_read_length   genome_complexity_reduction   contamination   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneSequencingexperiment : function({url, variables, token}){
    let query = `query readOneSequencingexperiment($id:ID!){
      readOneSequencingexperiment(id:$id){id  name   description   start_date   end_date   protocol   platform   data_type   library_type   library_preparation   aimed_coverage   resulting_coverage   insert_size   aimed_read_length   genome_complexity_reduction   contamination               countFilteredNucacidlibraryresults  countFilteredSamples   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateSequencingexperiment($id:ID!
     $name:String  $description:String  $start_date:String  $end_date:String  $protocol:String  $platform:String  $data_type:String  $library_type:String  $library_preparation:String  $aimed_coverage:Float  $resulting_coverage:Float  $insert_size:Float  $aimed_read_length:String  $genome_complexity_reduction:String  $contamination:String          $addNucacidlibraryresults:[ID] $removeNucacidlibraryresults:[ID]  $addSamples:[ID] $removeSamples:[ID]     ){
      updateSequencingexperiment(id:$id
       name:$name   description:$description   start_date:$start_date   end_date:$end_date   protocol:$protocol   platform:$platform   data_type:$data_type   library_type:$library_type   library_preparation:$library_preparation   aimed_coverage:$aimed_coverage   resulting_coverage:$resulting_coverage   insert_size:$insert_size   aimed_read_length:$aimed_read_length   genome_complexity_reduction:$genome_complexity_reduction   contamination:$contamination               addNucacidlibraryresults:$addNucacidlibraryresults removeNucacidlibraryresults:$removeNucacidlibraryresults  addSamples:$addSamples removeSamples:$removeSamples       ){id  name   description   start_date   end_date   protocol   platform   data_type   library_type   library_preparation   aimed_coverage   resulting_coverage   insert_size   aimed_read_length   genome_complexity_reduction   contamination  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteSequencingexperiment : function({url, variables, token}){
    let query = `mutation deleteSequencingexperiment($id:ID!){
      deleteSequencingexperiment(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
