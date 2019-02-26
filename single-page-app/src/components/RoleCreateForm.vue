<template>
  <div class="col-xs-5">
    <h4>New role</h4>
    <div id="role-div">
      <div v-if="role" class="content">
        <form id="role-form" v-on:submit.prevent="onSubmit">

          <role-form-elemns mode="create" v-bind:errors="errors" v-bind:role="role"></role-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import RoleFormElemns from './RoleFormElemns.vue'
import Queries from '../requests/index'

Vue.component('role-form-elemns', RoleFormElemns)

export default {
  data() {
    return {
      loading: false,
      role: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Role.create({url:url, variables: t.role})
      .then(function(response) {
          t.$router.push('/roles')
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
              this.role.addUsers = this.getOnlyIds(this.role.addUsers);
          }
  }
}
</script>
