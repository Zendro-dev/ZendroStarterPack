import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addNuc_acid_library_result(
   $lab_code:String  $file_name:String  $file_uri:String  $type:String  $insert_size:Float  $technical_replicate:Int  $trimmed:Boolean    $sample_id:Int     ){
    addNuc_acid_library_result(
     lab_code:$lab_code   file_name:$file_name   file_uri:$file_uri   type:$type   insert_size:$insert_size   technical_replicate:$technical_replicate   trimmed:$trimmed       sample_id:$sample_id         ){id  lab_code   file_name   file_uri   type   insert_size   technical_replicate   trimmed   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneNuc_acid_library_result : function({url, variables, token}){
    let query = `query readOneNuc_acid_library_result($id:ID!){
      readOneNuc_acid_library_result(id:$id){id  lab_code   file_name   file_uri   type   insert_size   technical_replicate   trimmed         sample{ name
         tissue  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateNuc_acid_library_result($id:ID!
     $lab_code:String  $file_name:String  $file_uri:String  $type:String  $insert_size:Float  $technical_replicate:Int  $trimmed:Boolean      $sample_id:Int         ){
      updateNuc_acid_library_result(id:$id
       lab_code:$lab_code   file_name:$file_name   file_uri:$file_uri   type:$type   insert_size:$insert_size   technical_replicate:$technical_replicate   trimmed:$trimmed         sample_id:$sample_id             ){id  lab_code   file_name   file_uri   type   insert_size   technical_replicate   trimmed  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteNuc_acid_library_result : function({url, variables, token}){
    let query = `mutation deleteNuc_acid_library_result($id:ID!){
      deleteNuc_acid_library_result(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
