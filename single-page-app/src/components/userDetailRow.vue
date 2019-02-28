<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>email:</label>
        <span>{{rowData.email}}</span>
      </div>
          <div class="inline field">
        <label>password:</label>
        <span>{{rowData.password}}</span>
      </div>
    
  
      
    <div id="user-roles-div" class="row w-100">
      <div class="col">
        <label>roles:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredRoles"
          query="readOneUser"
          subQuery="rolesFilter"
          label="name"
          subLabel="id"
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
