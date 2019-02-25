<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>field_name:</label>
        <span>{{rowData.field_name}}</span>
      </div>
          <div class="inline field">
        <label>coordinates_or_name:</label>
        <span>{{rowData.coordinates_or_name}}</span>
      </div>
          <div class="inline field">
        <label>year:</label>
        <span>{{rowData.year}}</span>
      </div>
          <div class="inline field">
        <label>area_sqm:</label>
        <span>{{rowData.area_sqm}}</span>
      </div>
          <div class="inline field">
        <label>type:</label>
        <span>{{rowData.type}}</span>
      </div>
    
      
    <div id="fieldplot-genotype-div">
      <div class="inline field">
        <label>genotype:</label>
        <span>{{genotypeInitialLabel}}</span>
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
          genotypeInitialLabel: function () {
      var x = this.rowData.genotype
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
