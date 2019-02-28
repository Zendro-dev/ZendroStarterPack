import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addMarker_data(
   $marker_name:String  $nucleotide:String    $individual_id:Int     ){
    addMarker_data(
     marker_name:$marker_name   nucleotide:$nucleotide       individual_id:$individual_id         ){id  marker_name   nucleotide   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneMarker_data : function({url, variables, token}){
    let query = `query readOneMarker_data($id:ID!){
      readOneMarker_data(id:$id){id  marker_name   nucleotide         individual{ name
         id  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateMarker_data($id:ID!
     $marker_name:String  $nucleotide:String      $individual_id:Int         ){
      updateMarker_data(id:$id
       marker_name:$marker_name   nucleotide:$nucleotide         individual_id:$individual_id             ){id  marker_name   nucleotide  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteMarker_data : function({url, variables, token}){
    let query = `mutation deleteMarker_data($id:ID!){
      deleteMarker_data(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
