<template>
  <div id="beedingpool-form-elemns-div">

  <input type="hidden" v-model="beedingpool.id"/>

  
    <div id="beedingpool-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="beedingpool.name" class="form-control"/>


      <div id="beedingpool-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="beedingpool-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="beedingpool.description" class="form-control"/>


      <div id="beedingpool-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
  

      
    <div id="beedingpool-genotypes-div" class="form-group">
      <label>genotypes</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="beedingpool.id"
        :countQuery="beedingpool.countFilteredGenotypes"
        :mode="mode"
        :addItems.sync="beedingpool.addGenotypes"
        label="name"
                    subLabel ="id"
                valueKey="id"
        model="Beedingpool"
        targetModel = "Genotype"
        removeName="removeGenotypes"
        addName="addGenotypes"
        query="readOneBeedingpool"
        subQuery="genotypesFilter"
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
  props: [ 'beedingpool', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'Genotype',
            label: 'name',
            sublabel: 'id'
        }              ],
      model: 'beedingpool'
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
