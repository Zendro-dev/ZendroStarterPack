import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addBeedingpool(
   $name:String  $description:String      $addGenotypes:[ID]  ){
    addBeedingpool(
     name:$name   description:$description           addGenotypes:$addGenotypes     ){id  name   description   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneBeedingpool : function({url, variables, token}){
    let query = `query readOneBeedingpool($id:ID!){
      readOneBeedingpool(id:$id){id  name   description               countFilteredGenotypes   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateBeedingpool($id:ID!
     $name:String  $description:String          $addGenotypes:[ID] $removeGenotypes:[ID]     ){
      updateBeedingpool(id:$id
       name:$name   description:$description               addGenotypes:$addGenotypes removeGenotypes:$removeGenotypes       ){id  name   description  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteBeedingpool : function({url, variables, token}){
    let query = `mutation deleteBeedingpool($id:ID!){
      deleteBeedingpool(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
