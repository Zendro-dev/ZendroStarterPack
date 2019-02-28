<template>
  <div class="col-xs-5">
    <h4>New nuc_acid_library_result</h4>
    <div id="nuc_acid_library_result-div">
      <div v-if="nuc_acid_library_result" class="content">
        <form id="nuc_acid_library_result-form" v-on:submit.prevent="onSubmit">

          <nuc_acid_library_result-form-elemns mode="create" v-bind:errors="errors" v-bind:nuc_acid_library_result="nuc_acid_library_result"></nuc_acid_library_result-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import nuc_acid_library_resultFormElemns from './nuc_acid_library_resultFormElemns.vue'
import Queries from '../requests/index'

Vue.component('nuc_acid_library_result-form-elemns', nuc_acid_library_resultFormElemns)

export default {
  data() {
    return {
      loading: false,
      nuc_acid_library_result: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Nuc_acid_library_result.create({url:url, variables: t.nuc_acid_library_result})
      .then(function(response) {
          t.$router.push('/nuc_acid_library_results')
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
