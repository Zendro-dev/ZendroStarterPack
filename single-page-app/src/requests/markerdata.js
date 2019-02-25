import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addMarkerdata(
   $marker_name:String  $nucleotide:String    $individual_id:Int     ){
    addMarkerdata(
     marker_name:$marker_name   nucleotide:$nucleotide       individual_id:$individual_id         ){id  marker_name   nucleotide   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneMarkerdata : function({url, variables, token}){
    let query = `query readOneMarkerdata($id:ID!){
      readOneMarkerdata(id:$id){id  marker_name   nucleotide         individual{ name
         id  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateMarkerdata($id:ID!
     $marker_name:String  $nucleotide:String      $individual_id:Int         ){
      updateMarkerdata(id:$id
       marker_name:$marker_name   nucleotide:$nucleotide         individual_id:$individual_id             ){id  marker_name   nucleotide  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteMarkerdata : function({url, variables, token}){
    let query = `mutation deleteMarkerdata($id:ID!){
      deleteMarkerdata(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
