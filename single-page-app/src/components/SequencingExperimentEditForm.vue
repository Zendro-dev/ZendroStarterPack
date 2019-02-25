<template>
  <div class="col-xs-5">
    <h4>Edit sequencingexperiment</h4>
    <div id="sequencingexperiment-div">
      <div v-if="sequencingexperiment" class="content">
        <form id="sequencingexperiment-form" v-on:submit.prevent="onSubmit">

          <sequencingexperiment-form-elemns mode="edit" v-bind:errors="errors" v-bind:sequencingexperiment="sequencingexperiment"></sequencingexperiment-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import SequencingExperimentFormElemns from './SequencingExperimentFormElemns.vue'
import queries from '../requests/sequencingexperiment'
import Queries from '../requests/index'

Vue.component('sequencingexperiment-form-elemns', SequencingExperimentFormElemns)

export default {
  data() {
    return {
      loading: false,
      sequencingexperiment: null,
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
        queries.readOneSequencingexperiment({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.sequencingexperiment = response.data.data.readOneSequencingexperiment          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Sequencingexperiment.update({url:url, variables:t.sequencingexperiment})
      .then(function (response) {
        t.$router.push('/sequencingexperiments')
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
