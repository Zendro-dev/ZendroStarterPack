<template>
  <div class="col-xs-5">
    <h4>Edit sequencing_experiment</h4>
    <div id="sequencing_experiment-div">
      <div v-if="sequencing_experiment" class="content">
        <form id="sequencing_experiment-form" v-on:submit.prevent="onSubmit">

          <sequencing_experiment-form-elemns mode="edit" v-bind:errors="errors" v-bind:sequencing_experiment="sequencing_experiment"></sequencing_experiment-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import sequencing_experimentFormElemns from './sequencing_experimentFormElemns.vue'
import queries from '../requests/sequencing_experiment'
import Queries from '../requests/index'

Vue.component('sequencing_experiment-form-elemns', sequencing_experimentFormElemns)

export default {
  data() {
    return {
      loading: false,
      sequencing_experiment: null,
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
        queries.readOneSequencing_experiment({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.sequencing_experiment = response.data.data.readOneSequencing_experiment          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Sequencing_experiment.update({url:url, variables:t.sequencing_experiment})
      .then(function (response) {
        t.$router.push('/sequencing_experiments')
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
