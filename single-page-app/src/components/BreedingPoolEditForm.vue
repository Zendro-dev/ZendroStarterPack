<template>
  <div class="col-xs-5">
    <h4>Edit breedingpool</h4>
    <div id="breedingpool-div">
      <div v-if="breedingpool" class="content">
        <form id="breedingpool-form" v-on:submit.prevent="onSubmit">

          <breedingpool-form-elemns mode="edit" v-bind:errors="errors" v-bind:breedingpool="breedingpool"></breedingpool-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BreedingPoolFormElemns from './BreedingPoolFormElemns.vue'
import queries from '../requests/breedingpool'
import Queries from '../requests/index'

Vue.component('breedingpool-form-elemns', BreedingPoolFormElemns)

export default {
  data() {
    return {
      loading: false,
      breedingpool: null,
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
        queries.readOneBreedingpool({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.breedingpool = response.data.data.readOneBreedingpool          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Breedingpool.update({url:url, variables:t.breedingpool})
      .then(function (response) {
        t.$router.push('/breedingpools')
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
