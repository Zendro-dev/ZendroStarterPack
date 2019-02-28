<template>
  <div id="individual-form-elemns-div">

  <input type="hidden" v-model="individual.id"/>

  
    <div id="individual-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="individual.name" class="form-control"/>


      <div id="individual-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="individual-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="individual.description" class="form-control"/>


      <div id="individual-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
      
    <div id="individual-genotype-div" class="form-group">
      <label>genotype</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="individual.genotype_id"
        label="name"
                    subLabel = "id"
                        valueKey="id"
        targetModel="Genotype"
        v-bind:initialInput="genotypeInitialLabel">
      </foreign-key-form-element>
    </div>

  

      
    <div id="individual-marker_data_snps-div" class="form-group">
      <label>marker_data_snps</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="individual.id"
        :countQuery="individual.countFilteredMarker_data"
        :mode="mode"
        :addItems.sync="individual.addMarker_data"
        label="marker_name"
                    subLabel ="nucleotide"
                valueKey="id"
        model="Individual"
        targetModel = "Marker_data"
        removeName="removeMarker_data"
        addName="addMarker_data"
        query="readOneIndividual"
        subQuery="marker_dataFilter"
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
  props: [ 'individual', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'Marker_data',
            label: 'marker_name',
            sublabel: 'nucleotide'
        }              ],
      model: 'individual'
    }
  },
  computed: {
            genotypeInitialLabel: function () {
      var x = this.individual.genotype
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
