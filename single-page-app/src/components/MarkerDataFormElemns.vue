<template>
  <div id="markerdata-form-elemns-div">

  <input type="hidden" v-model="markerdata.id"/>

  
    <div id="markerdata-marker_name-div" class="form-group">
            <label>marker_name</label>
      
  <input type="text" v-model="markerdata.marker_name" class="form-control"/>


      <div id="markerdata-marker_name-err" v-if="validationError('marker_name')" class="alert alert-danger">
        {{validationError('marker_name').message}}
      </div>
    </div>

  
    <div id="markerdata-nucleotide-div" class="form-group">
            <label>nucleotide</label>
      
  <input type="text" v-model="markerdata.nucleotide" class="form-control"/>


      <div id="markerdata-nucleotide-err" v-if="validationError('nucleotide')" class="alert alert-danger">
        {{validationError('nucleotide').message}}
      </div>
    </div>

  
      
    <div id="markerdata-individual-div" class="form-group">
      <label>individual</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="markerdata.individual_id"
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
  props: [ 'markerdata', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'markerdata'
    }
  },
  computed: {
            individualInitialLabel: function () {
      var x = this.markerdata.individual
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
