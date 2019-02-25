<template>
  <div id="measurement-form-elemns-div">

  <input type="hidden" v-model="measurement.id"/>

  
    <div id="measurement-method-div" class="form-group">
            <label>method</label>
      
  <input type="text" v-model="measurement.method" class="form-control"/>


      <div id="measurement-method-err" v-if="validationError('method')" class="alert alert-danger">
        {{validationError('method').message}}
      </div>
    </div>

  
    <div id="measurement-reference-div" class="form-group">
            <label>reference</label>
      
  <input type="text" v-model="measurement.reference" class="form-control"/>


      <div id="measurement-reference-err" v-if="validationError('reference')" class="alert alert-danger">
        {{validationError('reference').message}}
      </div>
    </div>

  
    <div id="measurement-float_value-div" class="form-group">
            <label>float_value</label>
      
  <input type="text" v-model="measurement.float_value" class="form-control"/>


      <div id="measurement-float_value-err" v-if="validationError('float_value')" class="alert alert-danger">
        {{validationError('float_value').message}}
      </div>
    </div>

  
    <div id="measurement-int_value-div" class="form-group">
            <label>int_value</label>
      
  <input type="text" v-model="measurement.int_value" class="form-control"/>


      <div id="measurement-int_value-err" v-if="validationError('int_value')" class="alert alert-danger">
        {{validationError('int_value').message}}
      </div>
    </div>

  
    <div id="measurement-text_value-div" class="form-group">
            <label>text_value</label>
      
  <input type="text" v-model="measurement.text_value" class="form-control"/>


      <div id="measurement-text_value-err" v-if="validationError('text_value')" class="alert alert-danger">
        {{validationError('text_value').message}}
      </div>
    </div>

  
    <div id="measurement-unit-div" class="form-group">
            <label>unit</label>
      
  <input type="text" v-model="measurement.unit" class="form-control"/>


      <div id="measurement-unit-err" v-if="validationError('unit')" class="alert alert-danger">
        {{validationError('unit').message}}
      </div>
    </div>

  
      
    <div id="measurement-fieldplot-div" class="form-group">
      <label>field_plot</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="measurement.field_plot_id"
        label="field_name"
                    subLabel = "coordinates_or_name"
                        valueKey="id"
        targetModel="Fieldplot"
        v-bind:initialInput="fieldplotInitialLabel">
      </foreign-key-form-element>
    </div>

  

  

  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

import inflection from 'inflection'
import axios from 'axios'

export default {
  props: [ 'measurement', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'measurement'
    }
  },
  computed: {
            fieldplotInitialLabel: function () {
      var x = this.measurement.field_plot
      if (x !== null && typeof x === 'object' &&
          x['field_name'] !== null &&
          typeof x['field_name'] !== 'undefined') {
        return x['field_name']
      } else {
        return ''
      }
    }
      
  },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.details.find(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	},
  created(){

  }
}
</script>
