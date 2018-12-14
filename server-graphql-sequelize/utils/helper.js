const objectAssign = require('object-assign');
const math = require('mathjs');

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

  requestedUrl = function(req) {
    //console.log(req.port)
    //console.log(req.headers.host)
    //let port = req.port|| 2000;
    return req.protocol + '://' + req.headers.host +
      //(port == 80 || port == 443 ? '' : ':' + port) +
      req.baseUrl;
  }


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

  sort = function(req) {
    let sortOpts = {}
    if (req.query.sort) {
      sortOpts = {
        order: [req.query.sort.split('|')]
      }
    }
    return sortOpts
  }

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


includeAssociations = function (req) {
    return req.query.excludeAssociations ? {} : {
      include: [{
        all: true
      }]
    }
}

searchPaginate = function(req, strAttributes) {
  return objectAssign(
    search(req, strAttributes),
    sort(req),
    paginate(req)
    //,includeAssociations(req)
  );
}

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
