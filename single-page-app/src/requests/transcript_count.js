import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addTranscript_count(
   $gene:String  $value:Float  $method:String  $reference_genome:String    $sample_id:Int     ){
    addTranscript_count(
     gene:$gene   value:$value   method:$method   reference_genome:$reference_genome       sample_id:$sample_id         ){id  gene   value   method   reference_genome   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneTranscript_count : function({url, variables, token}){
    let query = `query readOneTranscript_count($id:ID!){
      readOneTranscript_count(id:$id){id  gene   value   method   reference_genome         sample{ name
         tissue  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateTranscript_count($id:ID!
     $gene:String  $value:Float  $method:String  $reference_genome:String      $sample_id:Int         ){
      updateTranscript_count(id:$id
       gene:$gene   value:$value   method:$method   reference_genome:$reference_genome         sample_id:$sample_id             ){id  gene   value   method   reference_genome  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteTranscript_count : function({url, variables, token}){
    let query = `mutation deleteTranscript_count($id:ID!){
      deleteTranscript_count(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
