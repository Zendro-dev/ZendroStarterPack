import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addRole(
   $name:String  $description:String      $addUsers:[ID]  ){
    addRole(
     name:$name   description:$description           addUsers:$addUsers     ){id  name   description   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneRole : function({url, variables, token}){
    let query = `query readOneRole($id:ID!){
      readOneRole(id:$id){id  name   description               countFilteredUsers   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateRole($id:ID!
     $name:String  $description:String          $addUsers:[ID] $removeUsers:[ID]     ){
      updateRole(id:$id
       name:$name   description:$description               addUsers:$addUsers removeUsers:$removeUsers       ){id  name   description  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteRole : function({url, variables, token}){
    let query = `mutation deleteRole($id:ID!){
      deleteRole(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
