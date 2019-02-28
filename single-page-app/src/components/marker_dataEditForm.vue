<template>
  <div class="col-xs-5">
    <h4>Edit marker_data</h4>
    <div id="marker_data-div">
      <div v-if="marker_data" class="content">
        <form id="marker_data-form" v-on:submit.prevent="onSubmit">

          <marker_data-form-elemns mode="edit" v-bind:errors="errors" v-bind:marker_data="marker_data"></marker_data-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import marker_dataFormElemns from './marker_dataFormElemns.vue'
import queries from '../requests/marker_data'
import Queries from '../requests/index'

Vue.component('marker_data-form-elemns', marker_dataFormElemns)

export default {
  data() {
    return {
      loading: false,
      marker_data: null,
      error: null,
      errors: null,
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData',
  },
  methods: {
    fetchData() {
      var t = this
      t.error = null
      if(this.$route.params.id){
        queries.readOneMarker_data({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.marker_data = response.data.data.readOneMarker_data          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Marker_data.update({url:url, variables:t.marker_data})
      .then(function (response) {
        t.$router.push('/marker_data')
      }).catch( function (res) {
        if(res.response && res.response.data && res.response.data.errors && (res.response.data.errors[0].message === "Validation error")){
          t.errors = res.response.data.errors[0];
        }else{
          let msg = res;
          if(res && res.response && res.response.data && res.response.data.message){
             msg =  res.response.data.message
          }
          t.$root.$emit('globalError', msg)
          t.$router.push('/home')
        }
      })
    },

    getOnlyIds(array){
      return array.map((item)=>{ return item.id; });
    },

    getAssociationsIds(){
    }
  }
}
</script>
