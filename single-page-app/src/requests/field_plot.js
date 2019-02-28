import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addField_plot(
   $field_name:String  $coordinates_or_name:String  $year:String  $area_sqm:Float  $type:String    $genotype_id:Int     ){
    addField_plot(
     field_name:$field_name   coordinates_or_name:$coordinates_or_name   year:$year   area_sqm:$area_sqm   type:$type       genotype_id:$genotype_id         ){id  field_name   coordinates_or_name   year   area_sqm   type   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneField_plot : function({url, variables, token}){
    let query = `query readOneField_plot($id:ID!){
      readOneField_plot(id:$id){id  field_name   coordinates_or_name   year   area_sqm   type         genotype{ name
         id  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateField_plot($id:ID!
     $field_name:String  $coordinates_or_name:String  $year:String  $area_sqm:Float  $type:String      $genotype_id:Int         ){
      updateField_plot(id:$id
       field_name:$field_name   coordinates_or_name:$coordinates_or_name   year:$year   area_sqm:$area_sqm   type:$type         genotype_id:$genotype_id             ){id  field_name   coordinates_or_name   year   area_sqm   type  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteField_plot : function({url, variables, token}){
    let query = `mutation deleteField_plot($id:ID!){
      deleteField_plot(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
