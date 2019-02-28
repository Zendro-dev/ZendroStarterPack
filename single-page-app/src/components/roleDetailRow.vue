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
    
  
      
    <div id="role-users-div" class="row w-100">
      <div class="col">
        <label>users:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredUsers"
          query="readOneRole"
          subQuery="usersFilter"
          label=""
          subLabel=""
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
