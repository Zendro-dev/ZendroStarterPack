<template>
  <div class="col-xs-5">
    <h4>Edit nucacidlibraryresult</h4>
    <div id="nucacidlibraryresult-div">
      <div v-if="nucacidlibraryresult" class="content">
        <form id="nucacidlibraryresult-form" v-on:submit.prevent="onSubmit">

          <nucacidlibraryresult-form-elemns mode="edit" v-bind:errors="errors" v-bind:nucacidlibraryresult="nucacidlibraryresult"></nucacidlibraryresult-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import NucAcidLibraryResultFormElemns from './NucAcidLibraryResultFormElemns.vue'
import queries from '../requests/nucacidlibraryresult'
import Queries from '../requests/index'

Vue.component('nucacidlibraryresult-form-elemns', NucAcidLibraryResultFormElemns)

export default {
  data() {
    return {
      loading: false,
      nucacidlibraryresult: null,
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
        queries.readOneNucacidlibraryresult({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.nucacidlibraryresult = response.data.data.readOneNucacidlibraryresult          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Nucacidlibraryresult.update({url:url, variables:t.nucacidlibraryresult})
      .then(function (response) {
        t.$router.push('/nucacidlibraryresults')
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
