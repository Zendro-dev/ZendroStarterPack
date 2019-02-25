<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>method:</label>
        <span>{{rowData.method}}</span>
      </div>
          <div class="inline field">
        <label>reference:</label>
        <span>{{rowData.reference}}</span>
      </div>
          <div class="inline field">
        <label>float_value:</label>
        <span>{{rowData.float_value}}</span>
      </div>
          <div class="inline field">
        <label>int_value:</label>
        <span>{{rowData.int_value}}</span>
      </div>
          <div class="inline field">
        <label>text_value:</label>
        <span>{{rowData.text_value}}</span>
      </div>
          <div class="inline field">
        <label>unit:</label>
        <span>{{rowData.unit}}</span>
      </div>
    
      
    <div id="measurement-fieldplot-div">
      <div class="inline field">
        <label>field_plot:</label>
        <span>{{fieldplotInitialLabel}}</span>
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
          fieldplotInitialLabel: function () {
      var x = this.rowData.field_plot
      if (x !== null && typeof x === 'object' &&
          x['field_name'] !== null &&
          typeof x['field_name'] !== 'undefined') {
        return x['field_name']
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
