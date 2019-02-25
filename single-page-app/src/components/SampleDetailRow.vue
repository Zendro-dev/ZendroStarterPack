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
        <label>sampling_date:</label>
        <span>{{rowData.sampling_date}}</span>
      </div>
          <div class="inline field">
        <label>type:</label>
        <span>{{rowData.type}}</span>
      </div>
          <div class="inline field">
        <label>biological_replicate_no:</label>
        <span>{{rowData.biological_replicate_no}}</span>
      </div>
          <div class="inline field">
        <label>lab_code:</label>
        <span>{{rowData.lab_code}}</span>
      </div>
          <div class="inline field">
        <label>treatment:</label>
        <span>{{rowData.treatment}}</span>
      </div>
          <div class="inline field">
        <label>tissue:</label>
        <span>{{rowData.tissue}}</span>
      </div>
    
      
    <div id="sample-individual-div">
      <div class="inline field">
        <label>individual:</label>
        <span>{{individualInitialLabel}}</span>
      </div>
    </div>

      
    <div id="sample-sequencingexperiment-div">
      <div class="inline field">
        <label>sequencing_experiment:</label>
        <span>{{sequencingexperimentInitialLabel}}</span>
      </div>
    </div>

  
      
    <div id="sample-library_data-div" class="row w-100">
      <div class="col">
        <label>library_data:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredNucacidlibraryresults"
          query="readOneSample"
          subQuery="nucacidlibraryresultsFilter"
          label="lab_code"
          subLabel="file_name"
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
          individualInitialLabel: function () {
      var x = this.rowData.individual
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        ,
              sequencingexperimentInitialLabel: function () {
      var x = this.rowData.sequencing_experiment
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
