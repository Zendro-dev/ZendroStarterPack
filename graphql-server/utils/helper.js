const objectAssign = require('object-assign');
const math = require('mathjs');


  /**
   * paginate - Creates pagination argument as needed in sequelize cotaining limit and offset accordingly to the current
   * page implicit in the request info.
   *
   * @param  {object} req Request info.
   * @return {object}     Pagination argument.
   */
  paginate = function(req) {
    selectOpts = {}
    if (req.query.per_page){ selectOpts['limit'] = req.query.per_page}
    else{ selectOpts['limit'] = 20}
    if (req.query.page) {
      os = (req.query.page - 1) * selectOpts['limit']
      selectOpts['offset'] = os
    }
    return selectOpts
  }



  /**
   * requestedUrl - Recover baseUrl from the request.
   *
   * @param  {object} req Request info.
   * @return {string}     baseUrl from request.
   */
  requestedUrl = function(req) {
    //console.log(req.port)
    //console.log(req.headers.host)
    //let port = req.port|| 2000;
    return req.protocol + '://' + req.headers.host +
      //(port == 80 || port == 443 ? '' : ':' + port) +
      req.baseUrl;
  }



  /**
   * prevNextPageUrl - Creates request string for previous or next page int the vue-table data object.
   *
   * @param  {object} req        Request info.
   * @param  {boolean} isPrevious True if previous page is requestes and false if next page is requested.
   * @return {string}            String request for previous or next page int the vue-table data object.
   */
  prevNextPageUrl = function(req, isPrevious) {
    //console.log("Requested URL", req);
    let baseUrl = requestedUrl(req).replace(/\?.*$/, '')
    let query = ["query="+req.query.query]
    i = isPrevious ? -1 : 1
    // page
    p = req.query.page == '1' ? null : (req.query.page + i)
    query = query.concat(['page=' + p])
    // per_page
    query = query.concat(['per_page=' + (req.query.per_page || 20)])
    // filter
    if (req.query.filter) query = query.concat(['filter=' + req.query.filter])
    // sort
    if (req.query.sort) query = query.concat(['sort=' + req.query.sort])
    // Append query to base URL
    if (query.length > 0) baseUrl += "?" + query.join("&")
    return baseUrl
  }


  /**
   * sort - Creates sort argument as needed in sequelize and accordingly to the order implicit in the resquest info.
   *
   * @param  {object} req Request info.
   * @return {object}     Sort argument object as needed in the schema to retrieve filtered records from a given model.
   */
  sort = function(req) {
    let sortOpts = {}
    if (req.query.sort) {
      sortOpts = {
        order: [req.query.sort.split('|')]
      }
    }
    return sortOpts
  }


  /**
   * search - Creates search argument as needed in sequelize and accordingly to the filter string implicit in the resquest info.
   *
   * @param  {object} req           Request info. This info will contain the substring that will be used to filter records.
   * @param  {array} strAttributes Name of model's attributes
   * @return {object}               Search argument object as needed in the schema to retrieve filtered records from a given model.
   */
  search = function(req, strAttributes) {
    let selectOpts = {}
    if (req.query.filter) {
      let fieldClauses = []
      strAttributes.forEach(function(x) {
        let fieldWhereClause = {}
        if (x !== "id") {
          fieldWhereClause[x] = {
            $like: "%" + req.query.filter + "%"
          }
          fieldClauses = fieldClauses.concat([fieldWhereClause])
        } else {
          if (/^\d+$/.test(req.query.filter)) {
            fieldWhereClause[x] = req.query.filter
            fieldClauses = fieldClauses.concat([fieldWhereClause])
          }
        }
      })
       selectOpts['where'] = {
        $or: fieldClauses
      }
    }
    return selectOpts
  }


// includeAssociations = function (req) {
//     return req.query.excludeAssociations ? {} : {
//       include: [{
//         all: true
//       }]
//     }
// }

/**
 * searchPaginate - Creates one object mergin search, sort, and paginate arguments
 *
 * @param  {object} req           Request info.
 * @param  {array} strAttributes Name of model's attributes.
 * @return {object}               General argument for filtering models in sequelize.
 */
searchPaginate = function(req, strAttributes) {
  return objectAssign(
    search(req, strAttributes),
    sort(req),
    paginate(req)
    //,includeAssociations(req)
  );
}

/**
 * vueTable - Creates object needed to display a vue-table in a vuejs SPA
 *
 * @param  {object} req           Request info.
 * @param  {object} model         Sequelize model which records are intended to be displayed in the vue-table.
 * @param  {array} strAttributes Name of model's attributes.
 * @return {object}               Info for displaying vue-table in a vuejs SPA, including info for automatic pagination.
 */
module.exports.vueTable = function(req, model, strAttributes) {
  let searchOptions = search(req, strAttributes)
  let searchSortPagIncl = searchPaginate( req, strAttributes )
  let queries = []
  queries.push(model.count(searchOptions))
  queries.push(model.findAll(searchSortPagIncl))
  return Promise.all(queries).then(
    function(res) {
      let searchRes = res[0]
      let paginatedSearchRes = res[1]
      let lastPage = math.ceil(searchRes / req.query.per_page)
      return {
        data: paginatedSearchRes,
        total: searchRes,
        per_page: req.query.per_page,
        current_page: req.query.page,
        'from': (req.query.page - 1) * req.query.per_page + 1,
        'to': math.min(searchRes, req.query.page * req.query.per_page),
        last_page: lastPage,
        prev_page_url: (req.query.page == 1) ? null : prevNextPageUrl(
          req, true),
        next_page_url: (req.query.page == lastPage) ? null : prevNextPageUrl(
          req, false)
      }
    })
  }
