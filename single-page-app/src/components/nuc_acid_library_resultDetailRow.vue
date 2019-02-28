<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>lab_code:</label>
        <span>{{rowData.lab_code}}</span>
      </div>
          <div class="inline field">
        <label>file_name:</label>
        <span>{{rowData.file_name}}</span>
      </div>
          <div class="inline field">
        <label>file_uri:</label>
        <span>{{rowData.file_uri}}</span>
      </div>
          <div class="inline field">
        <label>type:</label>
        <span>{{rowData.type}}</span>
      </div>
          <div class="inline field">
        <label>insert_size:</label>
        <span>{{rowData.insert_size}}</span>
      </div>
          <div class="inline field">
        <label>technical_replicate:</label>
        <span>{{rowData.technical_replicate}}</span>
      </div>
          <div class="inline field">
        <label>trimmed:</label>
        <span>{{rowData.trimmed}}</span>
      </div>
    
      
    <div id="nuc_acid_library_result-sample-div">
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
