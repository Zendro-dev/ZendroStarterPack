<template>
  <div id="transcript_count-form-elemns-div">

  <input type="hidden" v-model="transcript_count.id"/>

  
    <div id="transcript_count-gene-div" class="form-group">
            <label>gene</label>
      
  <input type="text" v-model="transcript_count.gene" class="form-control"/>


      <div id="transcript_count-gene-err" v-if="validationError('gene')" class="alert alert-danger">
        {{validationError('gene').message}}
      </div>
    </div>

  
    <div id="transcript_count-value-div" class="form-group">
            <label>value</label>
      
  <input type="text" v-model="transcript_count.value" class="form-control"/>


      <div id="transcript_count-value-err" v-if="validationError('value')" class="alert alert-danger">
        {{validationError('value').message}}
      </div>
    </div>

  
    <div id="transcript_count-method-div" class="form-group">
            <label>method</label>
      
  <input type="text" v-model="transcript_count.method" class="form-control"/>


      <div id="transcript_count-method-err" v-if="validationError('method')" class="alert alert-danger">
        {{validationError('method').message}}
      </div>
    </div>

  
    <div id="transcript_count-reference_genome-div" class="form-group">
            <label>reference_genome</label>
      
  <input type="text" v-model="transcript_count.reference_genome" class="form-control"/>


      <div id="transcript_count-reference_genome-err" v-if="validationError('reference_genome')" class="alert alert-danger">
        {{validationError('reference_genome').message}}
      </div>
    </div>

  
      
    <div id="transcript_count-sample-div" class="form-group">
      <label>sample</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="transcript_count.sample_id"
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
  props: [ 'transcript_count', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'transcript_count'
    }
  },
  computed: {
            sampleInitialLabel: function () {
      var x = this.transcript_count.sample
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
