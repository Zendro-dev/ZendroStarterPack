<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>name:</label>
        <span>{{rowData.name}}</span>
      </div>
          <div class="inline field">
        <label>description:</label>
        <span>{{rowData.description}}</span>
      </div>
          <div class="inline field">
        <label>pedigree_type:</label>
        <span>{{rowData.pedigree_type}}</span>
      </div>
    
      
    <div id="genotype-individual-div">
      <div class="inline field">
        <label>mother:</label>
        <span>{{individualInitialLabel}}</span>
      </div>
    </div>

      
    <div id="genotype-individual-div">
      <div class="inline field">
        <label>father:</label>
        <span>{{individualInitialLabel}}</span>
      </div>
    </div>

      
    <div id="genotype-breeding_pool-div">
      <div class="inline field">
        <label>breeding_pool:</label>
        <span>{{breeding_poolInitialLabel}}</span>
      </div>
    </div>

  
  
  </div>
</template>

<script>
import Vue from 'vue'
import scrollListElement from './scrollListElement.vue'

Vue.component('scroll-list', scrollListElement)

export default {
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  computed: {
          individualInitialLabel: function () {
      var x = this.rowData.mother
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
      var x = this.rowData.father
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
      var x = this.rowData.breeding_pool
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
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
