<template>
  <div id="genotype-form-elemns-div">

  <input type="hidden" v-model="genotype.id"/>

  
    <div id="genotype-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="genotype.name" class="form-control"/>


      <div id="genotype-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="genotype-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="genotype.description" class="form-control"/>


      <div id="genotype-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
    <div id="genotype-pedigree_type-div" class="form-group">
            <label>pedigree_type</label>
      
  <input type="text" v-model="genotype.pedigree_type" class="form-control"/>


      <div id="genotype-pedigree_type-err" v-if="validationError('pedigree_type')" class="alert alert-danger">
        {{validationError('pedigree_type').message}}
      </div>
    </div>

  
      
    <div id="genotype-individual-div" class="form-group">
      <label>mother</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="genotype.mother_id"
        label="name"
                    subLabel = "id"
                        valueKey="id"
        targetModel="Individual"
        v-bind:initialInput="individualInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="genotype-individual-div" class="form-group">
      <label>father</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="genotype.father_id"
        label="name"
                    subLabel = "id"
                        valueKey="id"
        targetModel="Individual"
        v-bind:initialInput="individualInitialLabel">
      </foreign-key-form-element>
    </div>

      
    <div id="genotype-breeding_pool-div" class="form-group">
      <label>breeding_pool</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="genotype.breeding_pool_id"
        label="name"
                    subLabel = "id"
                        valueKey="id"
        targetModel="Breeding_pool"
        v-bind:initialInput="breeding_poolInitialLabel">
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
  props: [ 'genotype', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
             ],
      model: 'genotype'
    }
  },
  computed: {
            individualInitialLabel: function () {
      var x = this.genotype.mother
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
              individualInitialLabel: function () {
      var x = this.genotype.father
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
              breeding_poolInitialLabel: function () {
      var x = this.genotype.breeding_pool
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
