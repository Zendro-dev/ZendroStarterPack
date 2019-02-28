<template>
  <div class="col-xs-5">
    <h4>Edit sample</h4>
    <div id="sample-div">
      <div v-if="sample" class="content">
        <form id="sample-form" v-on:submit.prevent="onSubmit">

          <sample-form-elemns mode="edit" v-bind:errors="errors" v-bind:sample="sample"></sample-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import sampleFormElemns from './sampleFormElemns.vue'
import queries from '../requests/sample'
import Queries from '../requests/index'

Vue.component('sample-form-elemns', sampleFormElemns)

export default {
  data() {
    return {
      loading: false,
      sample: null,
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
        queries.readOneSample({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.sample = response.data.data.readOneSample          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Sample.update({url:url, variables:t.sample})
      .then(function (response) {
        t.$router.push('/samples')
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
