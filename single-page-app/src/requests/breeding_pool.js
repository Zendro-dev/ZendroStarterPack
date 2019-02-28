import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addBreeding_pool(
   $name:String  $description:String      $addGenotypes:[ID]  ){
    addBreeding_pool(
     name:$name   description:$description           addGenotypes:$addGenotypes     ){id  name   description   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneBreeding_pool : function({url, variables, token}){
    let query = `query readOneBreeding_pool($id:ID!){
      readOneBreeding_pool(id:$id){id  name   description               countFilteredGenotypes   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateBreeding_pool($id:ID!
     $name:String  $description:String          $addGenotypes:[ID] $removeGenotypes:[ID]     ){
      updateBreeding_pool(id:$id
       name:$name   description:$description               addGenotypes:$addGenotypes removeGenotypes:$removeGenotypes       ){id  name   description  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteBreeding_pool : function({url, variables, token}){
    let query = `mutation deleteBreeding_pool($id:ID!){
      deleteBreeding_pool(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
