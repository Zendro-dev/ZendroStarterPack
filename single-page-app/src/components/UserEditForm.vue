<template>
  <div class="col-xs-5">
    <h4>Edit user</h4>
    <div id="user-div">
      <div v-if="user" class="content">
        <form id="user-form" v-on:submit.prevent="onSubmit">

          <user-form-elemns mode="edit" v-bind:errors="errors" v-bind:user="user"></user-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import UserFormElemns from './UserFormElemns.vue'
import queries from '../requests/user'
import Queries from '../requests/index'

Vue.component('user-form-elemns', UserFormElemns)

export default {
  data() {
    return {
      loading: false,
      user: null,
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
        queries.readOneUser({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.user = response.data.data.readOneUser          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.User.update({url:url, variables:t.user})
      .then(function (response) {
        t.$router.push('/users')
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
