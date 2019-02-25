import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addSample(
   $name:String  $sampling_date:String  $type:String  $biological_replicate_no:Int  $lab_code:String  $treatment:String  $tissue:String    $individual_id:Int  $sequencing_experiment_id:Int    $addNucacidlibraryresults:[ID]  ){
    addSample(
     name:$name   sampling_date:$sampling_date   type:$type   biological_replicate_no:$biological_replicate_no   lab_code:$lab_code   treatment:$treatment   tissue:$tissue       individual_id:$individual_id  sequencing_experiment_id:$sequencing_experiment_id      addNucacidlibraryresults:$addNucacidlibraryresults     ){id  name   sampling_date   type   biological_replicate_no   lab_code   treatment   tissue   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneSample : function({url, variables, token}){
    let query = `query readOneSample($id:ID!){
      readOneSample(id:$id){id  name   sampling_date   type   biological_replicate_no   lab_code   treatment   tissue         individual{ name
         id  }  sequencing_experiment{ name
         platform  }        countFilteredNucacidlibraryresults   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateSample($id:ID!
     $name:String  $sampling_date:String  $type:String  $biological_replicate_no:Int  $lab_code:String  $treatment:String  $tissue:String      $individual_id:Int  $sequencing_experiment_id:Int      $addNucacidlibraryresults:[ID] $removeNucacidlibraryresults:[ID]     ){
      updateSample(id:$id
       name:$name   sampling_date:$sampling_date   type:$type   biological_replicate_no:$biological_replicate_no   lab_code:$lab_code   treatment:$treatment   tissue:$tissue         individual_id:$individual_id  sequencing_experiment_id:$sequencing_experiment_id        addNucacidlibraryresults:$addNucacidlibraryresults removeNucacidlibraryresults:$removeNucacidlibraryresults       ){id  name   sampling_date   type   biological_replicate_no   lab_code   treatment   tissue  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteSample : function({url, variables, token}){
    let query = `mutation deleteSample($id:ID!){
      deleteSample(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
