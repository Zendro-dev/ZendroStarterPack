<template>
  <div class="col-xs-5">
    <h4>Edit field_plot</h4>
    <div id="field_plot-div">
      <div v-if="field_plot" class="content">
        <form id="field_plot-form" v-on:submit.prevent="onSubmit">

          <field_plot-form-elemns mode="edit" v-bind:errors="errors" v-bind:field_plot="field_plot"></field_plot-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import field_plotFormElemns from './field_plotFormElemns.vue'
import queries from '../requests/field_plot'
import Queries from '../requests/index'

Vue.component('field_plot-form-elemns', field_plotFormElemns)

export default {
  data() {
    return {
      loading: false,
      field_plot: null,
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
        queries.readOneField_plot({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.field_plot = response.data.data.readOneField_plot          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Field_plot.update({url:url, variables:t.field_plot})
      .then(function (response) {
        t.$router.push('/field_plots')
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
