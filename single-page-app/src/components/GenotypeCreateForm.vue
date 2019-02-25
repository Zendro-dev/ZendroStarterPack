<template>
  <div class="col-xs-5">
    <h4>New genotype</h4>
    <div id="genotype-div">
      <div v-if="genotype" class="content">
        <form id="genotype-form" v-on:submit.prevent="onSubmit">

          <genotype-form-elemns mode="create" v-bind:errors="errors" v-bind:genotype="genotype"></genotype-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import GenotypeFormElemns from './GenotypeFormElemns.vue'
import Queries from '../requests/index'

Vue.component('genotype-form-elemns', GenotypeFormElemns)

export default {
  data() {
    return {
      loading: false,
      genotype: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Genotype.create({url:url, variables: t.genotype})
      .then(function(response) {
          t.$router.push('/genotypes')
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
          }
  }
}
</script>
