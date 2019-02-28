<template>
  <div id="breeding_pool-form-elemns-div">

  <input type="hidden" v-model="breeding_pool.id"/>

  
    <div id="breeding_pool-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="breeding_pool.name" class="form-control"/>


      <div id="breeding_pool-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="breeding_pool-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="breeding_pool.description" class="form-control"/>


      <div id="breeding_pool-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
  

      
    <div id="breeding_pool-genotypes-div" class="form-group">
      <label>genotypes</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="breeding_pool.id"
        :countQuery="breeding_pool.countFilteredGenotypes"
        :mode="mode"
        :addItems.sync="breeding_pool.addGenotypes"
        label="name"
                    subLabel ="id"
                valueKey="id"
        model="Breeding_pool"
        targetModel = "Genotype"
        removeName="removeGenotypes"
        addName="addGenotypes"
        query="readOneBreeding_pool"
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
  props: [ 'breeding_pool', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'Genotype',
            label: 'name',
            sublabel: 'id'
        }              ],
      model: 'breeding_pool'
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
