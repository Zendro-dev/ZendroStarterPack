<template>
  <div class="col-xs-5">
    <h4>Edit transcript_count</h4>
    <div id="transcript_count-div">
      <div v-if="transcript_count" class="content">
        <form id="transcript_count-form" v-on:submit.prevent="onSubmit">

          <transcript_count-form-elemns mode="edit" v-bind:errors="errors" v-bind:transcript_count="transcript_count"></transcript_count-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import transcript_countFormElemns from './transcript_countFormElemns.vue'
import queries from '../requests/transcript_count'
import Queries from '../requests/index'

Vue.component('transcript_count-form-elemns', transcript_countFormElemns)

export default {
  data() {
    return {
      loading: false,
      transcript_count: null,
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
        queries.readOneTranscript_count({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.transcript_count = response.data.data.readOneTranscript_count          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Transcript_count.update({url:url, variables:t.transcript_count})
      .then(function (response) {
        t.$router.push('/transcript_counts')
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
