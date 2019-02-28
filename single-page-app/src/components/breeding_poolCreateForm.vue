<template>
  <div class="col-xs-5">
    <h4>New breeding_pool</h4>
    <div id="breeding_pool-div">
      <div v-if="breeding_pool" class="content">
        <form id="breeding_pool-form" v-on:submit.prevent="onSubmit">

          <breeding_pool-form-elemns mode="create" v-bind:errors="errors" v-bind:breeding_pool="breeding_pool"></breeding_pool-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import breeding_poolFormElemns from './breeding_poolFormElemns.vue'
import Queries from '../requests/index'

Vue.component('breeding_pool-form-elemns', breeding_poolFormElemns)

export default {
  data() {
    return {
      loading: false,
      breeding_pool: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Breeding_pool.create({url:url, variables: t.breeding_pool})
      .then(function(response) {
          t.$router.push('/breeding_pools')
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
              this.breeding_pool.addGenotypes = this.getOnlyIds(this.breeding_pool.addGenotypes);
          }
  }
}
</script>
