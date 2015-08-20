// PUBLIC FUNCTIONS

// http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
vistk.utils.merge = function(d, e) {

  var obj = {},
      i = 0,
      il = arguments.length,
      key;
  for (; i < il; i++) {
      for (key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
              obj[key] = arguments[i][key];
          }
      }
  }
  return obj;
};

// TODO: add accessor as argument and var_time
vistk.utils.flatten_years = function(data) {
  var flat = [];

  //for each country
  data.forEach(function(root) {
    
      //for each year in each country
      root.years.forEach(function(year) {
          //extend the year object with the common properties stored just once in the country object

        var current_year = vistk.utils.merge(root, year);
        delete current_year.years;

          //add it to the final flat array
          flat.push(current_year);
      })
  });

  return flat;
}

vistk.utils.find_node_by_id = function(nodes, id) {
  var res = nodes.filter(function(d) {
    return d.id == id;
  })[0];

  // if(typeof res == "undefined")
   // console.log("id not found", id)

  return res;
}

vistk.utils.find_data_by_id = function(id) {
  var res = vars.new_data.filter(function(d) {
    return d[vars.var_id] == +id;
  })[0];

  // if(typeof res == "undefined")
  //  console.log("Data id not found", id)

  return res;
}

vistk.utils.find_node_coordinates_by_id = function(nodes, var_id, id) {

  var res = nodes.filter(function(d) {
    return d[var_id] == id;
  })[0];

  return res;
}

vistk.utils.max = function(data) {
  var var_time = this.var_time;
  return d3.max(data, function(d) { return d[var_time] });
}

vistk.utils.min = function(data) {
  var var_time = this.var_time;
  return d3.min(data, function(d) { return d[var_time] });
}

vistk.utils.time = {};

vistk.utils.time.current = function(data) {
  return vars.current_time;
}

vistk.utils.decode_url = function() {
  
  // Variables from query string
  var queryParameters = {}, queryString = location.search.substring(1),
      re = /([^&=]+)=([^&]*)/g, m, queryActivated = false;

  // Creates a map with the query string parameters
  while (m = re.exec(queryString)) {
    queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  return queryParameters;
}

// Credits: http://bl.ocks.org/mbostock/1705868
vistk.utils.translate_along = function(path) {
  var l = path.node().getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.node().getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

vistk.utils.find_unique_values = function(data, key) {

  var unique = {};
  var result = [];

  for(var i in data){
    if(typeof(unique[data[i][key]]) == "undefined"){
      result.push(data[i][key]);
    }
    unique[data[i][key]] = 0;
  }

  return result;

}

