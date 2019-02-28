import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addSequencing_experiment(
   $name:String  $description:String  $start_date:String  $end_date:String  $protocol:String  $platform:String  $data_type:String  $library_type:String  $library_preparation:String  $aimed_coverage:Float  $resulting_coverage:Float  $insert_size:Float  $aimed_read_length:String  $genome_complexity_reduction:String  $contamination:String      $addNuc_acid_library_results:[ID] $addSamples:[ID]  ){
    addSequencing_experiment(
     name:$name   description:$description   start_date:$start_date   end_date:$end_date   protocol:$protocol   platform:$platform   data_type:$data_type   library_type:$library_type   library_preparation:$library_preparation   aimed_coverage:$aimed_coverage   resulting_coverage:$resulting_coverage   insert_size:$insert_size   aimed_read_length:$aimed_read_length   genome_complexity_reduction:$genome_complexity_reduction   contamination:$contamination           addNuc_acid_library_results:$addNuc_acid_library_results  addSamples:$addSamples     ){id  name   description   start_date   end_date   protocol   platform   data_type   library_type   library_preparation   aimed_coverage   resulting_coverage   insert_size   aimed_read_length   genome_complexity_reduction   contamination   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneSequencing_experiment : function({url, variables, token}){
    let query = `query readOneSequencing_experiment($id:ID!){
      readOneSequencing_experiment(id:$id){id  name   description   start_date   end_date   protocol   platform   data_type   library_type   library_preparation   aimed_coverage   resulting_coverage   insert_size   aimed_read_length   genome_complexity_reduction   contamination               countFilteredNuc_acid_library_results  countFilteredSamples   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateSequencing_experiment($id:ID!
     $name:String  $description:String  $start_date:String  $end_date:String  $protocol:String  $platform:String  $data_type:String  $library_type:String  $library_preparation:String  $aimed_coverage:Float  $resulting_coverage:Float  $insert_size:Float  $aimed_read_length:String  $genome_complexity_reduction:String  $contamination:String          $addNuc_acid_library_results:[ID] $removeNuc_acid_library_results:[ID]  $addSamples:[ID] $removeSamples:[ID]     ){
      updateSequencing_experiment(id:$id
       name:$name   description:$description   start_date:$start_date   end_date:$end_date   protocol:$protocol   platform:$platform   data_type:$data_type   library_type:$library_type   library_preparation:$library_preparation   aimed_coverage:$aimed_coverage   resulting_coverage:$resulting_coverage   insert_size:$insert_size   aimed_read_length:$aimed_read_length   genome_complexity_reduction:$genome_complexity_reduction   contamination:$contamination               addNuc_acid_library_results:$addNuc_acid_library_results removeNuc_acid_library_results:$removeNuc_acid_library_results  addSamples:$addSamples removeSamples:$removeSamples       ){id  name   description   start_date   end_date   protocol   platform   data_type   library_type   library_preparation   aimed_coverage   resulting_coverage   insert_size   aimed_read_length   genome_complexity_reduction   contamination  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteSequencing_experiment : function({url, variables, token}){
    let query = `mutation deleteSequencing_experiment($id:ID!){
      deleteSequencing_experiment(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
