<template>
  <div id="marker_data-form-elemns-div">

  <input type="hidden" v-model="marker_data.id"/>

  
    <div id="marker_data-marker_name-div" class="form-group">
            <label>marker_name</label>
      
  <input type="text" v-model="marker_data.marker_name" class="form-control"/>


      <div id="marker_data-marker_name-err" v-if="validationError('marker_name')" class="alert alert-danger">
        {{validationError('marker_name').message}}
      </div>
    </div>

  
    <div id="marker_data-nucleotide-div" class="form-group">
            <label>nucleotide</label>
      
  <input type="text" v-model="marker_data.nucleotide" class="form-control"/>


      <div id="marker_data-nucleotide-err" v-if="validationError('nucleotide')" class="alert alert-danger">
        {{validationError('nucleotide').message}}
      </div>
    </div>

  
      
    <div id="marker_data-individual-div" class="form-group">
      <label>individual</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="marker_data.individual_id"
        label="name"
                    subLabel = "id"
                        valueKey="id"
        targetModel="Individual"
        v-bind:initialInput="individualInitialLabel">
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
  props: [ 'marker_data', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'marker_data'
    }
  },
  computed: {
            individualInitialLabel: function () {
      var x = this.marker_data.individual
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
