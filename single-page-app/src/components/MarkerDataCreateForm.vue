<template>
  <div class="col-xs-5">
    <h4>New markerdata</h4>
    <div id="markerdata-div">
      <div v-if="markerdata" class="content">
        <form id="markerdata-form" v-on:submit.prevent="onSubmit">

          <markerdata-form-elemns mode="create" v-bind:errors="errors" v-bind:markerdata="markerdata"></markerdata-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import MarkerDataFormElemns from './MarkerDataFormElemns.vue'
import Queries from '../requests/index'

Vue.component('markerdata-form-elemns', MarkerDataFormElemns)

export default {
  data() {
    return {
      loading: false,
      markerdata: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Markerdata.create({url:url, variables: t.markerdata})
      .then(function(response) {
          t.$router.push('/markerdata')
      }).catch(function(res) {
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
