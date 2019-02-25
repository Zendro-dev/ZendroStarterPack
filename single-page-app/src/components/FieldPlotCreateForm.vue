<template>
  <div class="col-xs-5">
    <h4>New fieldplot</h4>
    <div id="fieldplot-div">
      <div v-if="fieldplot" class="content">
        <form id="fieldplot-form" v-on:submit.prevent="onSubmit">

          <fieldplot-form-elemns mode="create" v-bind:errors="errors" v-bind:fieldplot="fieldplot"></fieldplot-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import FieldPlotFormElemns from './FieldPlotFormElemns.vue'
import Queries from '../requests/index'

Vue.component('fieldplot-form-elemns', FieldPlotFormElemns)

export default {
  data() {
    return {
      loading: false,
      fieldplot: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Fieldplot.create({url:url, variables: t.fieldplot})
      .then(function(response) {
          t.$router.push('/fieldplots')
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
