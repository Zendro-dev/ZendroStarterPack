<template>
  <div id="user-form-elemns-div">

  <input type="hidden" v-model="user.id"/>

  
    <div id="user-email-div" class="form-group">
            <label>email</label>
      
  <input type="text" v-model="user.email" class="form-control"/>


      <div id="user-email-err" v-if="validationError('email')" class="alert alert-danger">
        {{validationError('email').message}}
      </div>
    </div>

  
    <div id="user-password-div" class="form-group">
            <label>password</label>
      
  <input type="text" v-model="user.password" class="form-control"/>


      <div id="user-password-err" v-if="validationError('password')" class="alert alert-danger">
        {{validationError('password').message}}
      </div>
    </div>

  
  

      
    <div id="user-roles-div" class="form-group">
      <label>roles</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="user.id"
        :countQuery="user.countFilteredRoles"
        :mode="mode"
        :addItems.sync="user.addRoles"
        label=""
                        valueKey="id"
        model="User"
        targetModel = "Role"
        removeName="removeRoles"
        addName="addRoles"
        query="readOneUser"
        subQuery="rolesFilter"
        >
      </has-many-form-element>
    </div>

  

  </div>
</template>

<script>
import Vue from 'vue'


import hasManyFormElemn from './hasManyFormElemn.vue'

Vue.component('has-many-form-element', hasManyFormElemn)
import inflection from 'inflection'
import axios from 'axios'

export default {
  props: [ 'user', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'Role',
            label: '',
            sublabel: ''
        }              ],
      model: 'user'
    }
  },
  computed: {
    
  },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.details.find(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	},
  created(){

  }
}
</script>
