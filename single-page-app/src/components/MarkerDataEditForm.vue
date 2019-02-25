<template>
  <div class="col-xs-5">
    <h4>Edit markerdata</h4>
    <div id="markerdata-div">
      <div v-if="markerdata" class="content">
        <form id="markerdata-form" v-on:submit.prevent="onSubmit">

          <markerdata-form-elemns mode="edit" v-bind:errors="errors" v-bind:markerdata="markerdata"></markerdata-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import MarkerDataFormElemns from './MarkerDataFormElemns.vue'
import queries from '../requests/markerdata'
import Queries from '../requests/index'

Vue.component('markerdata-form-elemns', MarkerDataFormElemns)

export default {
  data() {
    return {
      loading: false,
      markerdata: null,
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
        queries.readOneMarkerdata({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.markerdata = response.data.data.readOneMarkerdata          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Markerdata.update({url:url, variables:t.markerdata})
      .then(function (response) {
        t.$router.push('/markerdata')
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
