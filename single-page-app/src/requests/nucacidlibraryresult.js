import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addNucacidlibraryresult(
   $lab_code:String  $file_name:String  $file_uri:String  $type:String  $insert_size:Float  $technical_replicate:Int  $trimmed:Boolean    $sample_id:Int     ){
    addNucacidlibraryresult(
     lab_code:$lab_code   file_name:$file_name   file_uri:$file_uri   type:$type   insert_size:$insert_size   technical_replicate:$technical_replicate   trimmed:$trimmed       sample_id:$sample_id         ){id  lab_code   file_name   file_uri   type   insert_size   technical_replicate   trimmed   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneNucacidlibraryresult : function({url, variables, token}){
    let query = `query readOneNucacidlibraryresult($id:ID!){
      readOneNucacidlibraryresult(id:$id){id  lab_code   file_name   file_uri   type   insert_size   technical_replicate   trimmed         sample{ name
         tissue  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateNucacidlibraryresult($id:ID!
     $lab_code:String  $file_name:String  $file_uri:String  $type:String  $insert_size:Float  $technical_replicate:Int  $trimmed:Boolean      $sample_id:Int         ){
      updateNucacidlibraryresult(id:$id
       lab_code:$lab_code   file_name:$file_name   file_uri:$file_uri   type:$type   insert_size:$insert_size   technical_replicate:$technical_replicate   trimmed:$trimmed         sample_id:$sample_id             ){id  lab_code   file_name   file_uri   type   insert_size   technical_replicate   trimmed  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteNucacidlibraryresult : function({url, variables, token}){
    let query = `mutation deleteNucacidlibraryresult($id:ID!){
      deleteNucacidlibraryresult(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
