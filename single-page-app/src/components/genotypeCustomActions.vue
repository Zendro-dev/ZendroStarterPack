<template>
  <div class="custom-actions">
    <button v-on:click="detailsToggle()" class="ui basic button"><i class="zoom icon"></i></button>
    <router-link v-bind:to="'genotype/' + rowData.id"><button class="ui basic button"><i class="edit icon"></i></button></router-link>
    <button v-on:click="confirmDelete()" class="ui basic button"><i class="delete icon"></i></button>
  </div>
</template>

<script>
import axios from 'axios'
import queries from '../requests/genotype'

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
  methods: {
    detailsToggle () {
      this.$parent.toggleDetailRow(this.rowData.id)
    },
    confirmDelete () {
      if (window.confirm("Do you really want to delete genotype of id '" + this.rowData
          .id + "'?")) {
        this.deleteInstance()
      }
    },
    deleteInstance () {
      var t = this;
      queries.deleteGenotype({url:this.$baseUrl(), variables: {id:this.rowData.id}})
      .then(function (response) {
        window.alert(response.data.data.deleteGenotype)
        t.$parent.reload()
      }).catch(function (error) {
        t.error = error
      })
    }
  }
}
</script>

<style>
.custom-actions button.ui.button {
  padding: 8px 8px;
}
.custom-actions button.ui.button > i.icon {
  margin: auto !important;
}
</style>
