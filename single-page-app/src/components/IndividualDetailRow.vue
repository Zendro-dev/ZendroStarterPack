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
    
      
    <div id="individual-genotype-div">
      <div class="inline field">
        <label>genotype:</label>
        <span>{{genotypeInitialLabel}}</span>
      </div>
    </div>

  
      
    <div id="individual-marker_data_snps-div" class="row w-100">
      <div class="col">
        <label>marker_data_snps:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredMarkerdata"
          query="readOneIndividual"
          subQuery="markerdataFilter"
          label="marker_name"
          subLabel="nucleotide"
        > </scroll-list>
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
