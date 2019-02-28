<template>
  <div id="sample-form-elemns-div">

  <input type="hidden" v-model="sample.id"/>

  
    <div id="sample-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="sample.name" class="form-control"/>


      <div id="sample-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="sample-sampling_date-div" class="form-group">
            <label>sampling_date</label>
      
  <input type="text" v-model="sample.sampling_date" class="form-control"/>


      <div id="sample-sampling_date-err" v-if="validationError('sampling_date')" class="alert alert-danger">
        {{validationError('sampling_date').message}}
      </div>
    </div>

  
    <div id="sample-type-div" class="form-group">
            <label>type</label>
      
  <input type="text" v-model="sample.type" class="form-control"/>


      <div id="sample-type-err" v-if="validationError('type')" class="alert alert-danger">
        {{validationError('type').message}}
      </div>
    </div>

  
    <div id="sample-biological_replicate_no-div" class="form-group">
            <label>biological_replicate_no</label>
      
  <input type="text" v-model="sample.biological_replicate_no" class="form-control"/>


      <div id="sample-biological_replicate_no-err" v-if="validationError('biological_replicate_no')" class="alert alert-danger">
        {{validationError('biological_replicate_no').message}}
      </div>
    </div>

  
    <div id="sample-lab_code-div" class="form-group">
            <label>lab_code</label>
      
  <input type="text" v-model="sample.lab_code" class="form-control"/>


      <div id="sample-lab_code-err" v-if="validationError('lab_code')" class="alert alert-danger">
        {{validationError('lab_code').message}}
      </div>
    </div>

  
    <div id="sample-treatment-div" class="form-group">
            <label>treatment</label>
      
  <input type="text" v-model="sample.treatment" class="form-control"/>


      <div id="sample-treatment-err" v-if="validationError('treatment')" class="alert alert-danger">
        {{validationError('treatment').message}}
      </div>
    </div>

  
    <div id="sample-tissue-div" class="form-group">
            <label>tissue</label>
      
  <input type="text" v-model="sample.tissue" class="form-control"/>


      <div id="sample-tissue-err" v-if="validationError('tissue')" class="alert alert-danger">
        {{validationError('tissue').message}}
      </div>
    </div>

  
      
    <div id="sample-individual-div" class="form-group">
      <label>individual</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="sample.individual_id"
        label="name"
                    subLabel = "id"
                        valueKey="id"
        targetModel="Individual"
        v-bind:initialInput="individualInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="sample-sequencing_experiment-div" class="form-group">
      <label>sequencing_experiment</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="sample.sequencing_experiment_id"
        label="name"
                    subLabel = "platform"
                        valueKey="id"
        targetModel="Sequencing_experiment"
        v-bind:initialInput="sequencing_experimentInitialLabel">
      </foreign-key-form-element>
    </div>

  

      
    <div id="sample-library_data-div" class="form-group">
      <label>library_data</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="sample.id"
        :countQuery="sample.countFilteredNuc_acid_library_results"
        :mode="mode"
        :addItems.sync="sample.addNuc_acid_library_results"
        label="lab_code"
                    subLabel ="file_name"
                valueKey="id"
        model="Sample"
        targetModel = "Nuc_acid_library_result"
        removeName="removeNuc_acid_library_results"
        addName="addNuc_acid_library_results"
        query="readOneSample"
        subQuery="nuc_acid_library_resultsFilter"
        >
      </has-many-form-element>
    </div>

  

  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

import hasManyFormElemn from './hasManyFormElemn.vue'

Vue.component('has-many-form-element', hasManyFormElemn)
import inflection from 'inflection'
import axios from 'axios'

export default {
  props: [ 'sample', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'Nuc_acid_library_result',
            label: 'lab_code',
            sublabel: 'file_name'
        }              ],
      model: 'sample'
    }
  },
  computed: {
            individualInitialLabel: function () {
      var x = this.sample.individual
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
              sequencing_experimentInitialLabel: function () {
      var x = this.sample.sequencing_experiment
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
