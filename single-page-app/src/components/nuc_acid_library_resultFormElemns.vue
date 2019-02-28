<template>
  <div id="nuc_acid_library_result-form-elemns-div">

  <input type="hidden" v-model="nuc_acid_library_result.id"/>

  
    <div id="nuc_acid_library_result-lab_code-div" class="form-group">
            <label>lab_code</label>
      
  <input type="text" v-model="nuc_acid_library_result.lab_code" class="form-control"/>


      <div id="nuc_acid_library_result-lab_code-err" v-if="validationError('lab_code')" class="alert alert-danger">
        {{validationError('lab_code').message}}
      </div>
    </div>

  
    <div id="nuc_acid_library_result-file_name-div" class="form-group">
            <label>file_name</label>
      
  <input type="text" v-model="nuc_acid_library_result.file_name" class="form-control"/>


      <div id="nuc_acid_library_result-file_name-err" v-if="validationError('file_name')" class="alert alert-danger">
        {{validationError('file_name').message}}
      </div>
    </div>

  
    <div id="nuc_acid_library_result-file_uri-div" class="form-group">
            <label>file_uri</label>
      
  <input type="text" v-model="nuc_acid_library_result.file_uri" class="form-control"/>


      <div id="nuc_acid_library_result-file_uri-err" v-if="validationError('file_uri')" class="alert alert-danger">
        {{validationError('file_uri').message}}
      </div>
    </div>

  
    <div id="nuc_acid_library_result-type-div" class="form-group">
            <label>type</label>
      
  <input type="text" v-model="nuc_acid_library_result.type" class="form-control"/>


      <div id="nuc_acid_library_result-type-err" v-if="validationError('type')" class="alert alert-danger">
        {{validationError('type').message}}
      </div>
    </div>

  
    <div id="nuc_acid_library_result-insert_size-div" class="form-group">
            <label>insert_size</label>
      
  <input type="text" v-model="nuc_acid_library_result.insert_size" class="form-control"/>


      <div id="nuc_acid_library_result-insert_size-err" v-if="validationError('insert_size')" class="alert alert-danger">
        {{validationError('insert_size').message}}
      </div>
    </div>

  
    <div id="nuc_acid_library_result-technical_replicate-div" class="form-group">
            <label>technical_replicate</label>
      
  <input type="text" v-model="nuc_acid_library_result.technical_replicate" class="form-control"/>


      <div id="nuc_acid_library_result-technical_replicate-err" v-if="validationError('technical_replicate')" class="alert alert-danger">
        {{validationError('technical_replicate').message}}
      </div>
    </div>

  
    <div id="nuc_acid_library_result-trimmed-div" class="form-group">
            <label>trimmed</label>
      
  <input type="checkbox" v-model="nuc_acid_library_result.trimmed" class="form-control"/>


      <div id="nuc_acid_library_result-trimmed-err" v-if="validationError('trimmed')" class="alert alert-danger">
        {{validationError('trimmed').message}}
      </div>
    </div>

  
      
    <div id="nuc_acid_library_result-sample-div" class="form-group">
      <label>sample</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="nuc_acid_library_result.sample_id"
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
  props: [ 'nuc_acid_library_result', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'nuc_acid_library_result'
    }
  },
  computed: {
            sampleInitialLabel: function () {
      var x = this.nuc_acid_library_result.sample
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
