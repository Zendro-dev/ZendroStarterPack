import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addMeasurement(
   $method:String  $reference:String  $float_value:Float  $int_value:Int  $text_value:String  $unit:String    $field_plot_id:Int     ){
    addMeasurement(
     method:$method   reference:$reference   float_value:$float_value   int_value:$int_value   text_value:$text_value   unit:$unit       field_plot_id:$field_plot_id         ){id  method   reference   float_value   int_value   text_value   unit   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneMeasurement : function({url, variables, token}){
    let query = `query readOneMeasurement($id:ID!){
      readOneMeasurement(id:$id){id  method   reference   float_value   int_value   text_value   unit         field_plot{ field_name
         coordinates_or_name  }         
    }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateMeasurement($id:ID!
     $method:String  $reference:String  $float_value:Float  $int_value:Int  $text_value:String  $unit:String      $field_plot_id:Int         ){
      updateMeasurement(id:$id
       method:$method   reference:$reference   float_value:$float_value   int_value:$int_value   text_value:$text_value   unit:$unit         field_plot_id:$field_plot_id             ){id  method   reference   float_value   int_value   text_value   unit  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteMeasurement : function({url, variables, token}){
    let query = `mutation deleteMeasurement($id:ID!){
      deleteMeasurement(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  }
}
