<template>
  <div class="row w-100">

    <div class="col-sm-3">
      <autocomplete
        ref="autocomplete"
        v-bind:url="searchUrl"
        param="filter"
        init-value=""
        v-bind:anchor="label"
        :label="parseSublabel"
        :classes="{ wrapper: 'form-wrapper', input: 'form-control', list: 'data-list', item: 'data-list-item' }"
        :on-select="addElement"
        :onInput="onUserInput"
        :customHeaders="{ Authorization: `Bearer ${this.$getAuthToken()}` }"
        :onShouldGetData="getDataPromise"
      >
      </autocomplete>
    </div>

    <div class="col-sm-5">
      <virtual-list class="list"
          :size="40"
          :remain="3"
          :tobottom="toBottom"
      >
          <div class="item" v-for="(udf, index) of associatedElements" :key="index">
              <i v-on:click="removeElement(udf)" class="delete icon"></i>
            {{ udf[label]}} <span v-if="subLabel!==''"> {{ udf[subLabel]}} </span>
          </div>
      </virtual-list>
    </div>

  </div>

</template>

<script>
import Vue from 'vue'
import Autocomplete from 'vue2-autocomplete-js'
import axios from 'axios'
import _ from 'lodash'
import inflection from 'inflection'
import virtualList from 'vue-virtual-scroll-list'

Vue.component('autocomplete', Autocomplete)

export default {
  data() {
    return {
      parseSublabel : this.subLabel ? this.subLabel : "",
      queryName : inflection.pluralize(this.targetModel.toLowerCase()),
      query: '',
      search : {
        operator: "or",
        search: [{
          field: this.label,
          value: {value : "%%"},
          operator: "like"
        } ]
      },
      pagination :{
        //default value of number for guess "to add" elements
        limit: 10,
        offset: 0
      }
    }
  },
  props: ['associatedElements', 'searchUrl', 'label', 'subLabel', 'valueKey','targetModel'],
  components: {
    Autocomplete,
    'virtual-list' : virtualList
  },
  methods: {
    addElement(data) {
      let modList = this.associatedElements ? _.clone(this.associatedElements) : []
      modList.push(data)
      modList = _.uniqBy(modList, 'id')
      this.$emit('update:associatedElements', modList)
      this.$refs.autocomplete.setValue(null)
    },
    removeElement(data) {
      let relId = this.valueKey;
      let modList = _.uniq(_.clone(this.associatedElements)).filter(function(x) {
        return x[relId] !== data[relId]
      })
      this.$emit('update:associatedElements', modList)
    },
    onUserInput(data) {
      if(data === ''){
        this.$emit('input', null)
      }
      this.search.search[0].value.value = "%"+data+"%";
      if(this.subLabel){
        this.search.search[1].value.value = "%"+data+"%";
      }
    },

    addSublabelFilter(){
      if(this.subLabel){
        let filter = {
            field: this.subLabel,
            value: {value : "%%"},
            operator: "like"
        }
        this.search.search.push(filter);
      }
    },
    getDataPromise(value){
      return new Promise((resolve, reject) => {
        let ajax = new XMLHttpRequest();
        let data = new FormData();
        ajax.open('POST', this.searchUrl, true);
        // On Done
        ajax.addEventListener('loadend', (e) => {
          const { responseText } = e.target
          let response = JSON.parse(responseText);
          // The options to pass in the autocomplete
          resolve(response.data[this.queryName])
        });
        data.append('query', this.query);
        data.append('variables', JSON.stringify({search:this.search, pagination: this.pagination}))
        ajax.send(data);
      })
    },
    createQuery(){
      this.query = `query
      ${this.queryName}($search: search${inflection.capitalize(this.targetModel)}Input $pagination: paginationInput)
       {${this.queryName}(search:$search pagination:$pagination){id ${this.label} ${this.parseSublabel}} }`
    },
    toBottom(){
      console.log("To be implemented...??");
    }
  },
  mounted: function(){
    this.addSublabelFilter();
    //set by default associated items to empty array
    if(this.associatedElements === undefined){
      this.$emit('update:associatedElements', []);
    }
  },
  created(){
    this.createQuery();
  }
}
</script>
<style>
.autocomplete,.autocomplete ul,.autocomplete ul li a,.showAll-transition,.transition{transition:all .3s ease-out;-moz-transition:all .3s ease-out;-webkit-transition:all .3s ease-out;-o-transition:all .3s ease-out}.autocomplete ul{font-family:sans-serif;position:absolute;list-style:none;background:#f8f8f8;padding:10px 0;margin:0;display:inline-block;min-width:15%;margin-top:10px}.autocomplete ul:before{content:"";display:block;position:absolute;height:0;width:0;border:10px solid transparent;border-bottom:10px solid #f8f8f8;left:46%;top:-20px}.autocomplete ul li a{text-decoration:none;display:block;background:#f8f8f8;color:#2b2b2b;padding:5px;padding-left:10px}.autocomplete ul li.focus-list a,.autocomplete ul li a:hover{color:#fff;background:#2f9af7}.autocomplete ul li a .autocomplete-anchor-label,.autocomplete ul li a span{display:block;margin-top:3px;color:grey;font-size:13px}.autocomplete ul li.focus-list a span,.autocomplete ul li a:hover .autocomplete-anchor-label{color:#fff}
.item {
    height: 40px;
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid #eee;
    background: white;
}
</style>
