/*
  Class to parse search argument for any model
*/

module.exports = class search{

  constructor({field, value, operator, search}){
    this.field = field;
    this.value = this.constructor.parseValue(value);
    this.operator = operator;
    this.search = search
  }

  static parseValue(val){
    if(val!==undefined)
    {
      if(val.type === "Array")
      {
        return val.value.split(",");
      }else{
        return val.value;
      }
    }
  }

  toSequelize(){
    let searchsInSequelize = {};

    if(this.search === undefined && this.field === undefined)
    {
      searchsInSequelize['$'+this.operator] = this.value;

    }else if(this.search === undefined)
    {
      searchsInSequelize[this.field] = {
         ['$'+this.operator] : this.value
      };
    }else if(this.field === undefined){
      searchsInSequelize['$'+this.operator] = this.search.map(sa => {
        let new_sa = new search(sa);
        return new_sa.toSequelize();
      });
    }else{
       searchsInSequelize[this.field] = {
         ['$'+this.operator] : this.search.map(sa => {
           let new_sa = new search(sa);
           return new_sa.toSequelize();
         })
       }
    }

    return searchsInSequelize;
  }
};
