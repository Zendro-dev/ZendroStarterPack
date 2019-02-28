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
        <label>start_date:</label>
        <span>{{rowData.start_date}}</span>
      </div>
          <div class="inline field">
        <label>end_date:</label>
        <span>{{rowData.end_date}}</span>
      </div>
          <div class="inline field">
        <label>protocol:</label>
        <span>{{rowData.protocol}}</span>
      </div>
          <div class="inline field">
        <label>platform:</label>
        <span>{{rowData.platform}}</span>
      </div>
          <div class="inline field">
        <label>data_type:</label>
        <span>{{rowData.data_type}}</span>
      </div>
          <div class="inline field">
        <label>library_type:</label>
        <span>{{rowData.library_type}}</span>
      </div>
          <div class="inline field">
        <label>library_preparation:</label>
        <span>{{rowData.library_preparation}}</span>
      </div>
          <div class="inline field">
        <label>aimed_coverage:</label>
        <span>{{rowData.aimed_coverage}}</span>
      </div>
          <div class="inline field">
        <label>resulting_coverage:</label>
        <span>{{rowData.resulting_coverage}}</span>
      </div>
          <div class="inline field">
        <label>insert_size:</label>
        <span>{{rowData.insert_size}}</span>
      </div>
          <div class="inline field">
        <label>aimed_read_length:</label>
        <span>{{rowData.aimed_read_length}}</span>
      </div>
          <div class="inline field">
        <label>genome_complexity_reduction:</label>
        <span>{{rowData.genome_complexity_reduction}}</span>
      </div>
          <div class="inline field">
        <label>contamination:</label>
        <span>{{rowData.contamination}}</span>
      </div>
    
  
      
    <div id="sequencing_experiment-nuc_acid_library_results-div" class="row w-100">
      <div class="col">
        <label>nuc_acid_library_results:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredNuc_acid_library_results"
          query="readOneSequencing_experiment"
          subQuery="nuc_acid_library_resultsFilter"
          label="lab_code"
          subLabel="file_name"
        > </scroll-list>
      </div>
    </div>


    
    <div id="sequencing_experiment-samples-div" class="row w-100">
      <div class="col">
        <label>samples:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredSamples"
          query="readOneSequencing_experiment"
          subQuery="samplesFilter"
          label="name"
          subLabel="type"
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
    },
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
