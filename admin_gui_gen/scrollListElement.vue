<template>
  <div id="scroll-form-div">

    <virtual-list class="list"
        :size="50"
        :remain="2"
        :tobottom="toBottom"
    >
        <div class="item" v-for="(udf, index) of items" :key="index">
          {{ udf[label]}} <span v-if="subLabel!==''"> {{ udf[subLabel]}} </span>
        </div>
    </virtual-list>

  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import virtualList from 'vue-virtual-scroll-list'

export default {
  data() {
    return {
      limit : 3,
      offset : 0,
      data_query: '',
      items: []
    }
  },
  props: ['url','idSelected', 'query' ,'subQuery', 'label', 'subLabel','countQuery'],
  components: {
    'virtual-list' : virtualList
  },
  methods: {
    toBottom(){
      this.getNextElements();
    },

    getNextElements(){
      if(this.checkAndSetLimits()){
        axios.post(this.url,{
          query:this.data_query,
          variables:{id:this.idSelected, limit: this.limit, offset: this.offset},
          headers: {
            'authorization': `Bearer ${this.$getAuthToken()}`,
            'Accept': 'application/graphql'}
        }).then( res =>{
          this.items.push(...res.data.data[this.query][this.subQuery]);
          this.offset+= this.limit;
        });
      }
    },

    checkAndSetLimits(){
      if(this.offset < this.countQuery){
        this.limit = Math.min( this.limit, this.countQuery - this.offset);
        return true;
      }
      return false;
    }
  },
  mounted: function(){
      },
  created(){
    this.data_query =
    `query ${this.query}($id: ID!, $offset:Int, $limit:Int) {
      ${this.query}(id:$id){ ${this.subQuery}(pagination:{limit: $limit offset:$offset }){ id ${this.label} ${this.subLabel} } } }`;

    //get initial elements
    this.getNextElements();
  }
}
</script>
<style>
    .item {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        border-bottom: 1px solid #eee;
        background: white;
    }
</style>
