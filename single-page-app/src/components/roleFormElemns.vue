<template>
  <div id="role-form-elemns-div">

  <input type="hidden" v-model="role.id"/>

  
    <div id="role-name-div" class="form-group">
            <label>name</label>
      
  <input type="text" v-model="role.name" class="form-control"/>


      <div id="role-name-err" v-if="validationError('name')" class="alert alert-danger">
        {{validationError('name').message}}
      </div>
    </div>

  
    <div id="role-description-div" class="form-group">
            <label>description</label>
      
  <input type="text" v-model="role.description" class="form-control"/>


      <div id="role-description-err" v-if="validationError('description')" class="alert alert-danger">
        {{validationError('description').message}}
      </div>
    </div>

  
  

      
    <div id="role-users-div" class="form-group">
      <label>users</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="role.id"
        :countQuery="role.countFilteredUsers"
        :mode="mode"
        :addItems.sync="role.addUsers"
        label=""
                        valueKey="id"
        model="Role"
        targetModel = "User"
        removeName="removeUsers"
        addName="addUsers"
        query="readOneRole"
        subQuery="usersFilter"
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
  props: [ 'role', 'errors', 'mode' ],
  data(){
    return{
      target_models: [
                     {
            model:'User',
            label: '',
            sublabel: ''
        }              ],
      model: 'role'
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
