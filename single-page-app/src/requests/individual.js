import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addIndividual(
   $name:String  $description:String    $genotype_id:Int    $addMarker_data:[ID]  ){
    addIndividual(
     name:$name   description:$description       genotype_id:$genotype_id      addMarker_data:$addMarker_data     ){id  name   description   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneIndividual : function({url, variables, token}){
    let query = `query readOneIndividual($id:ID!){
      readOneIndividual(id:$id){id  name   description         genotype{ name
         id  }        countFilteredMarker_data   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateIndividual($id:ID!
     $name:String  $description:String      $genotype_id:Int      $addMarker_data:[ID] $removeMarker_data:[ID]     ){
      updateIndividual(id:$id
       name:$name   description:$description         genotype_id:$genotype_id        addMarker_data:$addMarker_data removeMarker_data:$removeMarker_data       ){id  name   description  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteIndividual : function({url, variables, token}){
    let query = `mutation deleteIndividual($id:ID!){
      deleteIndividual(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
