<template>
  <div class="col-xs-5">
    <h4>New sample</h4>
    <div id="sample-div">
      <div v-if="sample" class="content">
        <form id="sample-form" v-on:submit.prevent="onSubmit">

          <sample-form-elemns mode="create" v-bind:errors="errors" v-bind:sample="sample"></sample-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import SampleFormElemns from './SampleFormElemns.vue'
import Queries from '../requests/index'

Vue.component('sample-form-elemns', SampleFormElemns)

export default {
  data() {
    return {
      loading: false,
      sample: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Sample.create({url:url, variables: t.sample})
      .then(function(response) {
          t.$router.push('/samples')
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
              this.sample.addNucacidlibraryresults = this.getOnlyIds(this.sample.addNucacidlibraryresults);
          }
  }
}
</script>
