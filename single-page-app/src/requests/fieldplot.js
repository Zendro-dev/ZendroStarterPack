import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addFieldplot(
   $field_name:String  $coordinates_or_name:String  $year:String  $area_sqm:Float  $type:String    $genotype_id:Int     ){
    addFieldplot(
     field_name:$field_name   coordinates_or_name:$coordinates_or_name   year:$year   area_sqm:$area_sqm   type:$type       genotype_id:$genotype_id         ){id  field_name   coordinates_or_name   year   area_sqm   type   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneFieldplot : function({url, variables, token}){
    let query = `query readOneFieldplot($id:ID!){
      readOneFieldplot(id:$id){id  field_name   coordinates_or_name   year   area_sqm   type         genotype{ name
         id  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateFieldplot($id:ID!
     $field_name:String  $coordinates_or_name:String  $year:String  $area_sqm:Float  $type:String      $genotype_id:Int         ){
      updateFieldplot(id:$id
       field_name:$field_name   coordinates_or_name:$coordinates_or_name   year:$year   area_sqm:$area_sqm   type:$type         genotype_id:$genotype_id             ){id  field_name   coordinates_or_name   year   area_sqm   type  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteFieldplot : function({url, variables, token}){
    let query = `mutation deleteFieldplot($id:ID!){
      deleteFieldplot(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
