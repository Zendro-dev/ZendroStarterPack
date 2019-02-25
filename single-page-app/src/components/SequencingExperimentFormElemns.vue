<template>
  <div id="sequencingexperiment-form-elemns-div">

  <input type="hidden" v-model="sequencingexperiment.id"/>

  
    <div id="sequencingexperiment-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="sequencingexperiment.name" class="form-control"/>


      <div id="sequencingexperiment-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="sequencingexperiment.description" class="form-control"/>


      <div id="sequencingexperiment-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-start_date-div" class="form-group">
            <label>start_date</label>
      
  <input type="text" v-model="sequencingexperiment.start_date" class="form-control"/>


      <div id="sequencingexperiment-start_date-err" v-if="validationError('start_date')" class="alert alert-danger">
        {{validationError('start_date').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-end_date-div" class="form-group">
            <label>end_date</label>
      
  <input type="text" v-model="sequencingexperiment.end_date" class="form-control"/>


      <div id="sequencingexperiment-end_date-err" v-if="validationError('end_date')" class="alert alert-danger">
        {{validationError('end_date').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-protocol-div" class="form-group">
            <label>protocol</label>
      
  <input type="text" v-model="sequencingexperiment.protocol" class="form-control"/>


      <div id="sequencingexperiment-protocol-err" v-if="validationError('protocol')" class="alert alert-danger">
        {{validationError('protocol').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-platform-div" class="form-group">
            <label>platform</label>
      
  <input type="text" v-model="sequencingexperiment.platform" class="form-control"/>


      <div id="sequencingexperiment-platform-err" v-if="validationError('platform')" class="alert alert-danger">
        {{validationError('platform').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-data_type-div" class="form-group">
            <label>data_type</label>
      
  <input type="text" v-model="sequencingexperiment.data_type" class="form-control"/>


      <div id="sequencingexperiment-data_type-err" v-if="validationError('data_type')" class="alert alert-danger">
        {{validationError('data_type').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-library_type-div" class="form-group">
            <label>library_type</label>
      
  <input type="text" v-model="sequencingexperiment.library_type" class="form-control"/>


      <div id="sequencingexperiment-library_type-err" v-if="validationError('library_type')" class="alert alert-danger">
        {{validationError('library_type').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-library_preparation-div" class="form-group">
            <label>library_preparation</label>
      
  <input type="text" v-model="sequencingexperiment.library_preparation" class="form-control"/>


      <div id="sequencingexperiment-library_preparation-err" v-if="validationError('library_preparation')" class="alert alert-danger">
        {{validationError('library_preparation').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-aimed_coverage-div" class="form-group">
            <label>aimed_coverage</label>
      
  <input type="text" v-model="sequencingexperiment.aimed_coverage" class="form-control"/>


      <div id="sequencingexperiment-aimed_coverage-err" v-if="validationError('aimed_coverage')" class="alert alert-danger">
        {{validationError('aimed_coverage').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-resulting_coverage-div" class="form-group">
            <label>resulting_coverage</label>
      
  <input type="text" v-model="sequencingexperiment.resulting_coverage" class="form-control"/>


      <div id="sequencingexperiment-resulting_coverage-err" v-if="validationError('resulting_coverage')" class="alert alert-danger">
        {{validationError('resulting_coverage').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-insert_size-div" class="form-group">
            <label>insert_size</label>
      
  <input type="text" v-model="sequencingexperiment.insert_size" class="form-control"/>


      <div id="sequencingexperiment-insert_size-err" v-if="validationError('insert_size')" class="alert alert-danger">
        {{validationError('insert_size').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-aimed_read_length-div" class="form-group">
            <label>aimed_read_length</label>
      
  <input type="text" v-model="sequencingexperiment.aimed_read_length" class="form-control"/>


      <div id="sequencingexperiment-aimed_read_length-err" v-if="validationError('aimed_read_length')" class="alert alert-danger">
        {{validationError('aimed_read_length').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-genome_complexity_reduction-div" class="form-group">
            <label>genome_complexity_reduction</label>
      
  <input type="text" v-model="sequencingexperiment.genome_complexity_reduction" class="form-control"/>


      <div id="sequencingexperiment-genome_complexity_reduction-err" v-if="validationError('genome_complexity_reduction')" class="alert alert-danger">
        {{validationError('genome_complexity_reduction').message}}
      </div>
    </div>

  
    <div id="sequencingexperiment-contamination-div" class="form-group">
            <label>contamination</label>
      
  <input type="text" v-model="sequencingexperiment.contamination" class="form-control"/>


      <div id="sequencingexperiment-contamination-err" v-if="validationError('contamination')" class="alert alert-danger">
        {{validationError('contamination').message}}
      </div>
    </div>

  
  

      
    <div id="sequencingexperiment-nuc_acid_library_results-div" class="form-group">
      <label>nuc_acid_library_results</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="sequencingexperiment.id"
        :countQuery="sequencingexperiment.countFilteredNucacidlibraryresults"
        :mode="mode"
        :addItems.sync="sequencingexperiment.addNucacidlibraryresults"
        label="lab_code"
                    subLabel ="file_name"
                valueKey="id"
        model="Sequencingexperiment"
        targetModel = "Nucacidlibraryresult"
        removeName="removeNucacidlibraryresults"
        addName="addNucacidlibraryresults"
        query="readOneSequencingexperiment"
        subQuery="nucacidlibraryresultsFilter"
        >
      </has-many-form-element>
    </div>

      
    <div id="sequencingexperiment-samples-div" class="form-group">
      <label>samples</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="sequencingexperiment.id"
        :countQuery="sequencingexperiment.countFilteredSamples"
        :mode="mode"
        :addItems.sync="sequencingexperiment.addSamples"
        label="name"
                    subLabel ="type"
                valueKey="id"
        model="Sequencingexperiment"
        targetModel = "Sample"
        removeName="removeSamples"
        addName="addSamples"
        query="readOneSequencingexperiment"
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
  props: [ 'sequencingexperiment', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'Nucacidlibraryresult',
            label: 'lab_code',
            sublabel: 'file_name'
        },                      {
            model:'Sample',
            label: 'name',
            sublabel: 'type'
        }              ],
      model: 'sequencingexperiment'
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
