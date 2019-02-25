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
        :on-select="addElementDirect"
        :onInput="onUserInput"
        :customHeaders="{ Authorization: `Bearer ${this.$store.getters.authToken}` }"
        :onShouldGetData="getDataPromise"
      >
      </autocomplete>
    </div>

    <div class="col-sm-5">
    <scroll-list class="list-group"
      :mode="mode"
      :url="this.$baseUrl()"
      :idSelected="idSelected"
      :countQuery="countItems"
      :query="query"
      :subQuery="subQuery"
      :label="label"
      :subLabel="parseSublabel"
      :displayItems="addItems"
      v-on:remove-element="removeElementDirect"
      :key="countItems"
    > </scroll-list>
    </div>

  </div>

</template>

<script>
import Vue from 'vue'
import Autocomplete from 'vue2-autocomplete-js'
import axios from 'axios'
import _ from 'lodash'
import inflection from 'inflection'
import Queries from '../requests/index'

Vue.component('autocomplete', Autocomplete)

export default {
  data() {
    return {
      parseSublabel : this.subLabel ? this.subLabel : "",
      queryName : inflection.pluralize(this.targetModel.toLowerCase()),
      queryAll: '',
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
      },
      countItems: this.countQuery
    }
  },
  props: ['model', 'searchUrl', 'idSelected','query', 'subQuery' ,'label', 'subLabel', 'countQuery','valueKey','targetModel', 'removeName', 'addName', 'mode', 'addItems'],
  components: {
    Autocomplete
  },
  methods: {
    addElementDirect(data){
      if(this.mode=="create"){
        let modList = this.addItems ? _.clone(this.addItems) : []
        modList.push(data)
        modList = _.uniqBy(modList, 'id')
        this.$emit('update:addItems', modList)

      }else{
        let variables = {
            id: this.idSelected,
            [this.addName]: [ data.id]
        }
        Queries[this.model].update({url:this.$baseUrl(), variables:variables })
        .then(()=>{
          this.countItems++;
        });
      }
      this.$refs.autocomplete.setValue(null)
    },
    removeElementDirect(dataId){
      if(this.mode=="create"){
        console.log("HERE WE CAN REMOVE LOCALLY")
        let relId = this.valueKey;
        let modList = _.uniq(_.clone(this.addItems)).filter(function(x) {
          return x[relId] !==  dataId//data[relId]
        })
        this.$emit('update:addItems', modList)
      }else{
        let variables = {
            id: this.idSelected,
            [this.removeName]: [dataId]
        }
        Queries[this.model].update({url:this.$baseUrl(), variables:variables})
        .then(()=>{
          this.countItems--;
        });
      }

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
        ajax.setRequestHeader('authorization',`Bearer ${this.$store.getters.authToken}`)
        // On Done
        ajax.addEventListener('loadend', (e) => {
          const { responseText } = e.target
          let response = JSON.parse(responseText);
          // The options to pass in the autocomplete
          resolve(response.data[this.queryName])
        });
        data.append('query', this.queryAll);
        data.append('variables', JSON.stringify({search:this.search, pagination: this.pagination}))
        ajax.send(data);
      })
    },
    createQuery(){
      this.queryAll = `query
      ${this.queryName}($search: search${inflection.capitalize(this.targetModel)}Input $pagination: paginationInput)
       {${this.queryName}(search:$search pagination:$pagination){id ${this.label} ${this.parseSublabel}} }`
    }
  },
  mounted: function(){
    this.addSublabelFilter();
  },
  created(){
    this.createQuery();
    if(this.mode==='create'){
      this.$emit('update:addItems', []);
    }
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
