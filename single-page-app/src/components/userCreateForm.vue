<template>
  <div class="col-xs-5">
    <h4>New user</h4>
    <div id="user-div">
      <div v-if="user" class="content">
        <form id="user-form" v-on:submit.prevent="onSubmit">

          <user-form-elemns mode="create" v-bind:errors="errors" v-bind:user="user"></user-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import userFormElemns from './userFormElemns.vue'
import Queries from '../requests/index'

Vue.component('user-form-elemns', userFormElemns)

export default {
  data() {
    return {
      loading: false,
      user: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.User.create({url:url, variables: t.user})
      .then(function(response) {
          t.$router.push('/users')
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
              this.user.addRoles = this.getOnlyIds(this.user.addRoles);
          }
  }
}
</script>
