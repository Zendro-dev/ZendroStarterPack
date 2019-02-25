<template>
  <div id="scroll-form-div">

    <virtual-list class="list"  v-if="mode!=='create'"
        :size="40"
        :remain="2"
        :tobottom="toBottom"
    >
        <div class="item" v-for="(udf, index) of items" :key="index">
          <i v-if="mode=='edit'" v-on:click="onRemove(udf)" class="delete icon"></i>
          {{ udf[label]}} <span v-if="subLabel!==''"> {{ udf[subLabel]}} </span>
        </div>

    </virtual-list>

  </virtual-list>

  <virtual-list class="list" v-if="mode=='create'"
      :size="40"
      :remain="2"
      :tobottom="toBottom">

      <div v-if="mode=='create'" class="item" v-for="(udf, index) of displayItems" :key="index">
        <i  v-on:click="onRemove(udf)" class="delete icon"></i>
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
  props: {
    url: String,
    idSelected: String,
    query: String ,
    subQuery: String,
    label: String,
    subLabel: String,
    countQuery: Number,
    mode: String,
    displayItems: Array
  },
  components: {
    'virtual-list' : virtualList
  },
  methods: {
    toBottom(){
      if(this.mode!=='create'){
        this.getNextElements();
      }else{
        console.log("When creating, to BOTTOM do NOTHING");
      }
    },

    getNextElements(){
      if(this.checkAndSetLimits()){
        axios.post(this.url,{
          query:this.data_query,
          variables:{id:this.idSelected, limit: this.limit, offset: this.offset}
        }).then( res =>{
          this.items.push(...res.data.data[this.query][this.subQuery]);
          this.offset+= this.limit;
        });
      }
    },
    onRemove(item){
      //console.log("Sending to remove item: ", item)
      this.$emit('remove-element', item.id)
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
    //console.log("CATCHING EDIT: ",this.edit);
    this.data_query =
    `query ${this.query}($id: ID!, $offset:Int, $limit:Int) {
      ${this.query}(id:$id){ ${this.subQuery}(pagination:{limit: $limit offset:$offset }){ id ${this.label} ${this.subLabel} } } }`;

      //console.log("FROM SCROLL MODE: ", this.mode);
    //get initial elements
    if(this.mode!=='create'){
      this.getNextElements();
    }

  }
}
</script>
<style>
    .item {
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        border-bottom: 1px solid #eee;
        background: white;
    }
</style>
