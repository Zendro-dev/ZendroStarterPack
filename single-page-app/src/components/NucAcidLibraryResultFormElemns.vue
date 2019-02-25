<template>
  <div id="nucacidlibraryresult-form-elemns-div">

  <input type="hidden" v-model="nucacidlibraryresult.id"/>

  
    <div id="nucacidlibraryresult-lab_code-div" class="form-group">
            <label>lab_code</label>
      
  <input type="text" v-model="nucacidlibraryresult.lab_code" class="form-control"/>


      <div id="nucacidlibraryresult-lab_code-err" v-if="validationError('lab_code')" class="alert alert-danger">
        {{validationError('lab_code').message}}
      </div>
    </div>

  
    <div id="nucacidlibraryresult-file_name-div" class="form-group">
            <label>file_name</label>
      
  <input type="text" v-model="nucacidlibraryresult.file_name" class="form-control"/>


      <div id="nucacidlibraryresult-file_name-err" v-if="validationError('file_name')" class="alert alert-danger">
        {{validationError('file_name').message}}
      </div>
    </div>

  
    <div id="nucacidlibraryresult-file_uri-div" class="form-group">
            <label>file_uri</label>
      
  <input type="text" v-model="nucacidlibraryresult.file_uri" class="form-control"/>


      <div id="nucacidlibraryresult-file_uri-err" v-if="validationError('file_uri')" class="alert alert-danger">
        {{validationError('file_uri').message}}
      </div>
    </div>

  
    <div id="nucacidlibraryresult-type-div" class="form-group">
            <label>type</label>
      
  <input type="text" v-model="nucacidlibraryresult.type" class="form-control"/>


      <div id="nucacidlibraryresult-type-err" v-if="validationError('type')" class="alert alert-danger">
        {{validationError('type').message}}
      </div>
    </div>

  
    <div id="nucacidlibraryresult-insert_size-div" class="form-group">
            <label>insert_size</label>
      
  <input type="text" v-model="nucacidlibraryresult.insert_size" class="form-control"/>


      <div id="nucacidlibraryresult-insert_size-err" v-if="validationError('insert_size')" class="alert alert-danger">
        {{validationError('insert_size').message}}
      </div>
    </div>

  
    <div id="nucacidlibraryresult-technical_replicate-div" class="form-group">
            <label>technical_replicate</label>
      
  <input type="text" v-model="nucacidlibraryresult.technical_replicate" class="form-control"/>


      <div id="nucacidlibraryresult-technical_replicate-err" v-if="validationError('technical_replicate')" class="alert alert-danger">
        {{validationError('technical_replicate').message}}
      </div>
    </div>

  
    <div id="nucacidlibraryresult-trimmed-div" class="form-group">
            <label>trimmed</label>
      
  <input type="checkbox" v-model="nucacidlibraryresult.trimmed" class="form-control"/>


      <div id="nucacidlibraryresult-trimmed-err" v-if="validationError('trimmed')" class="alert alert-danger">
        {{validationError('trimmed').message}}
      </div>
    </div>

  
      
    <div id="nucacidlibraryresult-sample-div" class="form-group">
      <label>sample</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="nucacidlibraryresult.sample_id"
        label="name"
                    subLabel = "tissue"
                        valueKey="id"
        targetModel="Sample"
        v-bind:initialInput="sampleInitialLabel">
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
  props: [ 'nucacidlibraryresult', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'nucacidlibraryresult'
    }
  },
  computed: {
            sampleInitialLabel: function () {
      var x = this.nucacidlibraryresult.sample
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
