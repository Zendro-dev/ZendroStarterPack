<template>
  <div id="transcriptcount-form-elemns-div">

  <input type="hidden" v-model="transcriptcount.id"/>

  
    <div id="transcriptcount-gene-div" class="form-group">
            <label>gene</label>
      
  <input type="text" v-model="transcriptcount.gene" class="form-control"/>


      <div id="transcriptcount-gene-err" v-if="validationError('gene')" class="alert alert-danger">
        {{validationError('gene').message}}
      </div>
    </div>

  
    <div id="transcriptcount-value-div" class="form-group">
            <label>value</label>
      
  <input type="text" v-model="transcriptcount.value" class="form-control"/>


      <div id="transcriptcount-value-err" v-if="validationError('value')" class="alert alert-danger">
        {{validationError('value').message}}
      </div>
    </div>

  
    <div id="transcriptcount-method-div" class="form-group">
            <label>method</label>
      
  <input type="text" v-model="transcriptcount.method" class="form-control"/>


      <div id="transcriptcount-method-err" v-if="validationError('method')" class="alert alert-danger">
        {{validationError('method').message}}
      </div>
    </div>

  
    <div id="transcriptcount-reference_genome-div" class="form-group">
            <label>reference_genome</label>
      
  <input type="text" v-model="transcriptcount.reference_genome" class="form-control"/>


      <div id="transcriptcount-reference_genome-err" v-if="validationError('reference_genome')" class="alert alert-danger">
        {{validationError('reference_genome').message}}
      </div>
    </div>

  
      
    <div id="transcriptcount-sample-div" class="form-group">
      <label>sample</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="transcriptcount.sample_id"
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
  props: [ 'transcriptcount', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'transcriptcount'
    }
  },
  computed: {
            sampleInitialLabel: function () {
      var x = this.transcriptcount.sample
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
