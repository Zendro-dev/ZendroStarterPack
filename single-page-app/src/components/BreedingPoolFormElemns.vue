<template>
  <div id="breedingpool-form-elemns-div">

  <input type="hidden" v-model="breedingpool.id"/>

  
    <div id="breedingpool-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="breedingpool.name" class="form-control"/>


      <div id="breedingpool-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="breedingpool-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="breedingpool.description" class="form-control"/>


      <div id="breedingpool-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
  

      
    <div id="breedingpool-genotypes-div" class="form-group">
      <label>genotypes</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="breedingpool.id"
        :countQuery="breedingpool.countFilteredGenotypes"
        :mode="mode"
        :addItems.sync="breedingpool.addGenotypes"
        label="name"
                    subLabel ="id"
                valueKey="id"
        model="Breedingpool"
        targetModel = "Genotype"
        removeName="removeGenotypes"
        addName="addGenotypes"
        query="readOneBreedingpool"
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
  props: [ 'breedingpool', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'Genotype',
            label: 'name',
            sublabel: 'id'
        }              ],
      model: 'breedingpool'
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
