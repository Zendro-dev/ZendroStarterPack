import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addGenotype(
   $name:String  $description:String  $pedigree_type:String    $mother_id:Int  $father_id:Int  $breeding_pool_id:Int     ){
    addGenotype(
     name:$name   description:$description   pedigree_type:$pedigree_type       mother_id:$mother_id  father_id:$father_id  breeding_pool_id:$breeding_pool_id         ){id  name   description   pedigree_type   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneGenotype : function({url, variables, token}){
    let query = `query readOneGenotype($id:ID!){
      readOneGenotype(id:$id){id  name   description   pedigree_type         mother{ name
         id  }  father{ name
         id  }  breeding_pool{ name
         id  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateGenotype($id:ID!
     $name:String  $description:String  $pedigree_type:String      $mother_id:Int  $father_id:Int  $breeding_pool_id:Int         ){
      updateGenotype(id:$id
       name:$name   description:$description   pedigree_type:$pedigree_type         mother_id:$mother_id  father_id:$father_id  breeding_pool_id:$breeding_pool_id             ){id  name   description   pedigree_type  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteGenotype : function({url, variables, token}){
    let query = `mutation deleteGenotype($id:ID!){
      deleteGenotype(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
