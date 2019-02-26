<template>
  <div class="col-xs-5">
    <h4>New breedingpool</h4>
    <div id="breedingpool-div">
      <div v-if="breedingpool" class="content">
        <form id="breedingpool-form" v-on:submit.prevent="onSubmit">

          <breedingpool-form-elemns mode="create" v-bind:errors="errors" v-bind:breedingpool="breedingpool"></breedingpool-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BreedingPoolFormElemns from './BreedingPoolFormElemns.vue'
import Queries from '../requests/index'

Vue.component('breedingpool-form-elemns', BreedingPoolFormElemns)

export default {
  data() {
    return {
      loading: false,
      breedingpool: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Breedingpool.create({url:url, variables: t.breedingpool})
      .then(function(response) {
          t.$router.push('/breedingpools')
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
              this.breedingpool.addGenotypes = this.getOnlyIds(this.breedingpool.addGenotypes);
          }
  }
}
</script>
