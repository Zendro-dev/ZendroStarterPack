<template>
  <div class="col-xs-5">
    <h4>Edit fieldplot</h4>
    <div id="fieldplot-div">
      <div v-if="fieldplot" class="content">
        <form id="fieldplot-form" v-on:submit.prevent="onSubmit">

          <fieldplot-form-elemns mode="edit" v-bind:errors="errors" v-bind:fieldplot="fieldplot"></fieldplot-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import FieldPlotFormElemns from './FieldPlotFormElemns.vue'
import queries from '../requests/fieldplot'
import Queries from '../requests/index'

Vue.component('fieldplot-form-elemns', FieldPlotFormElemns)

export default {
  data() {
    return {
      loading: false,
      fieldplot: null,
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
        queries.readOneFieldplot({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.fieldplot = response.data.data.readOneFieldplot          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Fieldplot.update({url:url, variables:t.fieldplot})
      .then(function (response) {
        t.$router.push('/fieldplots')
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
