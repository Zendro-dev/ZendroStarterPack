import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addUser(
   $email:String  $password:String      $addRoles:[ID]  ){
    addUser(
     email:$email   password:$password           addRoles:$addRoles     ){id  email   password   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneUser : function({url, variables, token}){
    let query = `query readOneUser($id:ID!){
      readOneUser(id:$id){id  email   password               countFilteredRoles   
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateUser($id:ID!
     $email:String  $password:String          $addRoles:[ID] $removeRoles:[ID]     ){
      updateUser(id:$id
       email:$email   password:$password               addRoles:$addRoles removeRoles:$removeRoles       ){id  email   password  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteUser : function({url, variables, token}){
    let query = `mutation deleteUser($id:ID!){
      deleteUser(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
