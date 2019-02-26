import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addBreedingpool(
   $name:String  $description:String      $addGenotypes:[ID]  ){
    addBreedingpool(
     name:$name   description:$description           addGenotypes:$addGenotypes     ){id  name   description   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneBreedingpool : function({url, variables, token}){
    let query = `query readOneBreedingpool($id:ID!){
      readOneBreedingpool(id:$id){id  name   description               countFilteredGenotypes   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateBreedingpool($id:ID!
     $name:String  $description:String          $addGenotypes:[ID] $removeGenotypes:[ID]     ){
      updateBreedingpool(id:$id
       name:$name   description:$description               addGenotypes:$addGenotypes removeGenotypes:$removeGenotypes       ){id  name   description  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteBreedingpool : function({url, variables, token}){
    let query = `mutation deleteBreedingpool($id:ID!){
      deleteBreedingpool(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
