<template>
  <div class="col-xs-5">
    <h4>New sequencingexperiment</h4>
    <div id="sequencingexperiment-div">
      <div v-if="sequencingexperiment" class="content">
        <form id="sequencingexperiment-form" v-on:submit.prevent="onSubmit">

          <sequencingexperiment-form-elemns mode="create" v-bind:errors="errors" v-bind:sequencingexperiment="sequencingexperiment"></sequencingexperiment-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import SequencingExperimentFormElemns from './SequencingExperimentFormElemns.vue'
import Queries from '../requests/index'

Vue.component('sequencingexperiment-form-elemns', SequencingExperimentFormElemns)

export default {
  data() {
    return {
      loading: false,
      sequencingexperiment: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Sequencingexperiment.create({url:url, variables: t.sequencingexperiment})
      .then(function(response) {
          t.$router.push('/sequencingexperiments')
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
              this.sequencingexperiment.addNucacidlibraryresults = this.getOnlyIds(this.sequencingexperiment.addNucacidlibraryresults);
              this.sequencingexperiment.addSamples = this.getOnlyIds(this.sequencingexperiment.addSamples);
          }
  }
}
</script>
