<template>
  <div id="fieldplot-form-elemns-div">

  <input type="hidden" v-model="fieldplot.id"/>

  
    <div id="fieldplot-field_name-div" class="form-group">
            <label>field_name</label>
      
  <input type="text" v-model="fieldplot.field_name" class="form-control"/>


      <div id="fieldplot-field_name-err" v-if="validationError('field_name')" class="alert alert-danger">
        {{validationError('field_name').message}}
      </div>
    </div>

  
    <div id="fieldplot-coordinates_or_name-div" class="form-group">
            <label>coordinates_or_name</label>
      
  <input type="text" v-model="fieldplot.coordinates_or_name" class="form-control"/>


      <div id="fieldplot-coordinates_or_name-err" v-if="validationError('coordinates_or_name')" class="alert alert-danger">
        {{validationError('coordinates_or_name').message}}
      </div>
    </div>

  
    <div id="fieldplot-year-div" class="form-group">
            <label>year</label>
      
  <input type="text" v-model="fieldplot.year" class="form-control"/>


      <div id="fieldplot-year-err" v-if="validationError('year')" class="alert alert-danger">
        {{validationError('year').message}}
      </div>
    </div>

  
    <div id="fieldplot-area_sqm-div" class="form-group">
            <label>area_sqm</label>
      
  <input type="text" v-model="fieldplot.area_sqm" class="form-control"/>


      <div id="fieldplot-area_sqm-err" v-if="validationError('area_sqm')" class="alert alert-danger">
        {{validationError('area_sqm').message}}
      </div>
    </div>

  
    <div id="fieldplot-type-div" class="form-group">
            <label>type</label>
      
  <input type="text" v-model="fieldplot.type" class="form-control"/>


      <div id="fieldplot-type-err" v-if="validationError('type')" class="alert alert-danger">
        {{validationError('type').message}}
      </div>
    </div>

  
      
    <div id="fieldplot-genotype-div" class="form-group">
      <label>genotype</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="fieldplot.genotype_id"
        label="name"
                    subLabel = "id"
                        valueKey="id"
        targetModel="Genotype"
        v-bind:initialInput="genotypeInitialLabel">
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
  props: [ 'fieldplot', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'fieldplot'
    }
  },
  computed: {
            genotypeInitialLabel: function () {
      var x = this.fieldplot.genotype
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
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
