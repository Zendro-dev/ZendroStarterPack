<template>
  <div class="col-xs-5">
    <h4>New individual</h4>
    <div id="individual-div">
      <div v-if="individual" class="content">
        <form id="individual-form" v-on:submit.prevent="onSubmit">

          <individual-form-elemns mode="create" v-bind:errors="errors" v-bind:individual="individual"></individual-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import IndividualFormElemns from './IndividualFormElemns.vue'
import Queries from '../requests/index'

Vue.component('individual-form-elemns', IndividualFormElemns)

export default {
  data() {
    return {
      loading: false,
      individual: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Individual.create({url:url, variables: t.individual})
      .then(function(response) {
          t.$router.push('/individuals')
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
              this.individual.addMarkerdata = this.getOnlyIds(this.individual.addMarkerdata);
          }
  }
}
</script>
