<template>
  <div id="sequencing_experiment-form-elemns-div">

  <input type="hidden" v-model="sequencing_experiment.id"/>

  
    <div id="sequencing_experiment-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="sequencing_experiment.name" class="form-control"/>


      <div id="sequencing_experiment-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="sequencing_experiment.description" class="form-control"/>


      <div id="sequencing_experiment-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-start_date-div" class="form-group">
            <label>start_date</label>
      
  <input type="text" v-model="sequencing_experiment.start_date" class="form-control"/>


      <div id="sequencing_experiment-start_date-err" v-if="validationError('start_date')" class="alert alert-danger">
        {{validationError('start_date').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-end_date-div" class="form-group">
            <label>end_date</label>
      
  <input type="text" v-model="sequencing_experiment.end_date" class="form-control"/>


      <div id="sequencing_experiment-end_date-err" v-if="validationError('end_date')" class="alert alert-danger">
        {{validationError('end_date').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-protocol-div" class="form-group">
            <label>protocol</label>
      
  <input type="text" v-model="sequencing_experiment.protocol" class="form-control"/>


      <div id="sequencing_experiment-protocol-err" v-if="validationError('protocol')" class="alert alert-danger">
        {{validationError('protocol').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-platform-div" class="form-group">
            <label>platform</label>
      
  <input type="text" v-model="sequencing_experiment.platform" class="form-control"/>


      <div id="sequencing_experiment-platform-err" v-if="validationError('platform')" class="alert alert-danger">
        {{validationError('platform').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-data_type-div" class="form-group">
            <label>data_type</label>
      
  <input type="text" v-model="sequencing_experiment.data_type" class="form-control"/>


      <div id="sequencing_experiment-data_type-err" v-if="validationError('data_type')" class="alert alert-danger">
        {{validationError('data_type').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-library_type-div" class="form-group">
            <label>library_type</label>
      
  <input type="text" v-model="sequencing_experiment.library_type" class="form-control"/>


      <div id="sequencing_experiment-library_type-err" v-if="validationError('library_type')" class="alert alert-danger">
        {{validationError('library_type').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-library_preparation-div" class="form-group">
            <label>library_preparation</label>
      
  <input type="text" v-model="sequencing_experiment.library_preparation" class="form-control"/>


      <div id="sequencing_experiment-library_preparation-err" v-if="validationError('library_preparation')" class="alert alert-danger">
        {{validationError('library_preparation').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-aimed_coverage-div" class="form-group">
            <label>aimed_coverage</label>
      
  <input type="text" v-model="sequencing_experiment.aimed_coverage" class="form-control"/>


      <div id="sequencing_experiment-aimed_coverage-err" v-if="validationError('aimed_coverage')" class="alert alert-danger">
        {{validationError('aimed_coverage').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-resulting_coverage-div" class="form-group">
            <label>resulting_coverage</label>
      
  <input type="text" v-model="sequencing_experiment.resulting_coverage" class="form-control"/>


      <div id="sequencing_experiment-resulting_coverage-err" v-if="validationError('resulting_coverage')" class="alert alert-danger">
        {{validationError('resulting_coverage').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-insert_size-div" class="form-group">
            <label>insert_size</label>
      
  <input type="text" v-model="sequencing_experiment.insert_size" class="form-control"/>


      <div id="sequencing_experiment-insert_size-err" v-if="validationError('insert_size')" class="alert alert-danger">
        {{validationError('insert_size').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-aimed_read_length-div" class="form-group">
            <label>aimed_read_length</label>
      
  <input type="text" v-model="sequencing_experiment.aimed_read_length" class="form-control"/>


      <div id="sequencing_experiment-aimed_read_length-err" v-if="validationError('aimed_read_length')" class="alert alert-danger">
        {{validationError('aimed_read_length').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-genome_complexity_reduction-div" class="form-group">
            <label>genome_complexity_reduction</label>
      
  <input type="text" v-model="sequencing_experiment.genome_complexity_reduction" class="form-control"/>


      <div id="sequencing_experiment-genome_complexity_reduction-err" v-if="validationError('genome_complexity_reduction')" class="alert alert-danger">
        {{validationError('genome_complexity_reduction').message}}
      </div>
    </div>

  
    <div id="sequencing_experiment-contamination-div" class="form-group">
            <label>contamination</label>
      
  <input type="text" v-model="sequencing_experiment.contamination" class="form-control"/>


      <div id="sequencing_experiment-contamination-err" v-if="validationError('contamination')" class="alert alert-danger">
        {{validationError('contamination').message}}
      </div>
    </div>

  
  

      
    <div id="sequencing_experiment-nuc_acid_library_results-div" class="form-group">
      <label>nuc_acid_library_results</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="sequencing_experiment.id"
        :countQuery="sequencing_experiment.countFilteredNuc_acid_library_results"
        :mode="mode"
        :addItems.sync="sequencing_experiment.addNuc_acid_library_results"
        label="lab_code"
                    subLabel ="file_name"
                valueKey="id"
        model="Sequencing_experiment"
        targetModel = "Nuc_acid_library_result"
        removeName="removeNuc_acid_library_results"
        addName="addNuc_acid_library_results"
        query="readOneSequencing_experiment"
        subQuery="nuc_acid_library_resultsFilter"
        >
      </has-many-form-element>
    </div>

      
    <div id="sequencing_experiment-samples-div" class="form-group">
      <label>samples</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="sequencing_experiment.id"
        :countQuery="sequencing_experiment.countFilteredSamples"
        :mode="mode"
        :addItems.sync="sequencing_experiment.addSamples"
        label="name"
                    subLabel ="type"
                valueKey="id"
        model="Sequencing_experiment"
        targetModel = "Sample"
        removeName="removeSamples"
        addName="addSamples"
        query="readOneSequencing_experiment"
        subQuery="samplesFilter"
        >
      </has-many-form-element>
    </div>

  

  </div>
</template>

<script>
import Vue from 'vue'


import hasManyFormElemn from './hasManyFormElemn.vue'

Vue.component('has-many-form-element', hasManyFormElemn)
import inflection from 'inflection'
import axios from 'axios'

export default {
  props: [ 'sequencing_experiment', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'Nuc_acid_library_result',
            label: 'lab_code',
            sublabel: 'file_name'
        },                      {
            model:'Sample',
            label: 'name',
            sublabel: 'type'
        }              ],
      model: 'sequencing_experiment'
    }
  },
  computed: {
    
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
