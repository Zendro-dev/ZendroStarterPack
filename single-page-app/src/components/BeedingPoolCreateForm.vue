<template>
  <div class="col-xs-5">
    <h4>New beedingpool</h4>
    <div id="beedingpool-div">
      <div v-if="beedingpool" class="content">
        <form id="beedingpool-form" v-on:submit.prevent="onSubmit">

          <beedingpool-form-elemns mode="create" v-bind:errors="errors" v-bind:beedingpool="beedingpool"></beedingpool-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BeedingPoolFormElemns from './BeedingPoolFormElemns.vue'
import Queries from '../requests/index'

Vue.component('beedingpool-form-elemns', BeedingPoolFormElemns)

export default {
  data() {
    return {
      loading: false,
      beedingpool: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Beedingpool.create({url:url, variables: t.beedingpool})
      .then(function(response) {
          t.$router.push('/beedingpools')
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
              this.beedingpool.addGenotypes = this.getOnlyIds(this.beedingpool.addGenotypes);
          }
  }
}
</script>
