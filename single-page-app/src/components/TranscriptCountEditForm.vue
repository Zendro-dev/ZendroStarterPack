<template>
  <div class="col-xs-5">
    <h4>Edit transcriptcount</h4>
    <div id="transcriptcount-div">
      <div v-if="transcriptcount" class="content">
        <form id="transcriptcount-form" v-on:submit.prevent="onSubmit">

          <transcriptcount-form-elemns mode="edit" v-bind:errors="errors" v-bind:transcriptcount="transcriptcount"></transcriptcount-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import TranscriptCountFormElemns from './TranscriptCountFormElemns.vue'
import queries from '../requests/transcriptcount'
import Queries from '../requests/index'

Vue.component('transcriptcount-form-elemns', TranscriptCountFormElemns)

export default {
  data() {
    return {
      loading: false,
      transcriptcount: null,
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
        queries.readOneTranscriptcount({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.transcriptcount = response.data.data.readOneTranscriptcount          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Transcriptcount.update({url:url, variables:t.transcriptcount})
      .then(function (response) {
        t.$router.push('/transcriptcounts')
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
