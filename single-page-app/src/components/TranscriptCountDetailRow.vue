<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>gene:</label>
        <span>{{rowData.gene}}</span>
      </div>
          <div class="inline field">
        <label>value:</label>
        <span>{{rowData.value}}</span>
      </div>
          <div class="inline field">
        <label>method:</label>
        <span>{{rowData.method}}</span>
      </div>
          <div class="inline field">
        <label>reference_genome:</label>
        <span>{{rowData.reference_genome}}</span>
      </div>
    
      
    <div id="transcriptcount-sample-div">
      <div class="inline field">
        <label>sample:</label>
        <span>{{sampleInitialLabel}}</span>
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
          sampleInitialLabel: function () {
      var x = this.rowData.sample
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
