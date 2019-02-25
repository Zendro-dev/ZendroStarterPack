import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addIndividual(
   $name:String  $description:String    $genotype_id:Int    $addMarkerdata:[ID]  ){
    addIndividual(
     name:$name   description:$description       genotype_id:$genotype_id      addMarkerdata:$addMarkerdata     ){id  name   description   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneIndividual : function({url, variables, token}){
    let query = `query readOneIndividual($id:ID!){
      readOneIndividual(id:$id){id  name   description         genotype{ name
         id  }        countFilteredMarkerdata   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateIndividual($id:ID!
     $name:String  $description:String      $genotype_id:Int      $addMarkerdata:[ID] $removeMarkerdata:[ID]     ){
      updateIndividual(id:$id
       name:$name   description:$description         genotype_id:$genotype_id        addMarkerdata:$addMarkerdata removeMarkerdata:$removeMarkerdata       ){id  name   description  }
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
