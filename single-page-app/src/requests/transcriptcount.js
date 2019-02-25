import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addTranscriptcount(
   $gene:String  $value:Float  $method:String  $reference_genome:String    $sample_id:Int     ){
    addTranscriptcount(
     gene:$gene   value:$value   method:$method   reference_genome:$reference_genome       sample_id:$sample_id         ){id  gene   value   method   reference_genome   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneTranscriptcount : function({url, variables, token}){
    let query = `query readOneTranscriptcount($id:ID!){
      readOneTranscriptcount(id:$id){id  gene   value   method   reference_genome         sample{ name
         tissue  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateTranscriptcount($id:ID!
     $gene:String  $value:Float  $method:String  $reference_genome:String      $sample_id:Int         ){
      updateTranscriptcount(id:$id
       gene:$gene   value:$value   method:$method   reference_genome:$reference_genome         sample_id:$sample_id             ){id  gene   value   method   reference_genome  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteTranscriptcount : function({url, variables, token}){
    let query = `mutation deleteTranscriptcount($id:ID!){
      deleteTranscriptcount(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
