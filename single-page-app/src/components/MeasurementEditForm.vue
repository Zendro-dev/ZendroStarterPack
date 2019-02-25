<template>
  <div class="col-xs-5">
    <h4>Edit measurement</h4>
    <div id="measurement-div">
      <div v-if="measurement" class="content">
        <form id="measurement-form" v-on:submit.prevent="onSubmit">

          <measurement-form-elemns mode="edit" v-bind:errors="errors" v-bind:measurement="measurement"></measurement-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import MeasurementFormElemns from './MeasurementFormElemns.vue'
import queries from '../requests/measurement'
import Queries from '../requests/index'

Vue.component('measurement-form-elemns', MeasurementFormElemns)

export default {
  data() {
    return {
      loading: false,
      measurement: null,
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
        queries.readOneMeasurement({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.measurement = response.data.data.readOneMeasurement          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Measurement.update({url:url, variables:t.measurement})
      .then(function (response) {
        t.$router.push('/measurements')
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
