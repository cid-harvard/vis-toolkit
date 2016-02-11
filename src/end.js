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

  return res;
}

vistk.utils.find_node_coordinates_by_id = function(nodes, var_id, data_id) {

  var res = nodes.filter(function(node) {
    return node[var_id] == data_id;
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

vistk.utils.extent = function(data, var_data) {
  return d3.extent(data, function(d) { return d[var_data] });
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

vistk.utils.list = function(param) {
  return list[param];
}

vistk.utils.scale = {};

vistk.utils.scale.linear = function(vars) {

  return [{
    func: d3.scale.linear()
            .range([vars.margin.left, vars.width - vars.margin.left - vars.margin.right])
            .domain([vars.margin.left, vars.width - vars.margin.left - vars.margin.right])
  }];

};

vistk.utils.scale.none = function(vars) {

  return [{
    func: d3.scale.linear()
            .range([0, 0])
  }];

};

vistk.utils.scale.x = {};

vistk.utils.scale.x.center = function(vars) {

  return [{
    func: d3.scale.linear()
            .range([0, 0])
  }];

};

vistk.utils.init_item = function(d) {
  d.__aggregated = false;
  d.__selected = false;
  d.__selected__adjacent = false;
  d.__highlighted = false;
  d.__highlighted__adjacent = false;
  d.__missing = false;
  d.__redraw = false;
};

// Creates
vistk.utils.aggregate = function(data, vars, var_agg, type_agg) {

  var type_agg = type_agg || 'sum';

  return d3.nest()
        .key(function(d) {

          if(vars.time.current_time === null) {
            return d[var_agg];
          } else {
            return d.values[vars.time.current_time][var_agg];
          }

        })
        .rollup(function(leaves) {

          // Generates a new dataset with aggregated data
          var aggregation = {};

          if(vars.time.current_time === null) {
            aggregation[vars.var_id] = 'agg_' + leaves[0][var_agg];
          } else {
            aggregation[vars.var_id] = 'agg_' + leaves[0].values[vars.time.current_time][var_agg] + Math.random();
          }

          // Name and id values are

          aggregation[vars.var_text] = leaves[0][vars.var_group];
          aggregation[vars.var_group] = leaves[0][vars.var_group];

          // Quick fix in case var_x is an ordinal scale
          if(vars.var_x !== vars.var_id && vars.var_x !== vars.time.var_time && vars.var_x !== vars.var_group) {

            aggregation[vars.var_x] = d3.mean(leaves, function(d) {
              return d[vars.var_x];
            });

          } else {

            aggregation[vars.var_x] = leaves[0][vars.var_x];

          }

          if(vars.var_y !== vars.var_id && vars.var_y !== vars.time.var_time) {

            aggregation[vars.var_y] = d3.mean(leaves, function(d) {
              return d[vars.var_y];
            });

          } else {

            aggregation[vars.var_y] = leaves[0][vars.var_y];

          }

          aggregation[vars.var_r] = d3.sum(leaves, function(d) {
            return d[vars.var_r];
          });

          aggregation[vars.var_share] = d3.sum(leaves, function(d) {
            return d[vars.var_share];
          });

          aggregation[vars.var_color] = leaves[0][vars.var_color];

          // Init temporal values
          aggregation.values = [];

          // Assuming all the time values are present in all items
          vars.time.points.forEach(function(time, i) {

            var d = {};

           // if(vars.var_x === vars.time.var_time) {
           //   d[vars.var_x] = leaves[0].values[i][vars.var_x];
           // } else {
           //   d[vars.var_x] = 0;
           // }

            // Init values
            d[vars.var_x] = leaves[0].values[time][vars.var_x];
            d[vars.var_y] = leaves[0].values[time][vars.var_y];
            d[vars.var_r] = leaves[0].values[time][vars.var_r];

            d[vars.var_share] = leaves[0].values[time][vars.var_share];
            d[vars.var_color] = leaves[0].values[time][vars.var_color];
            d[vars.var_size] = leaves[0].values[time][vars.var_size];
            d[vars.var_text] = leaves[0].values[time][vars.var_text];

            // Time var
            d[vars.time.var_time] = leaves[0].values[time][vars.time.var_time];

            // Should stay at the bottom to make sure it's not overriden
            d[vars.var_id] = 'agg_' + leaves[0].values[time][vars.var_id];

            d.__index = 'agg_' + leaves[0].values[time].__index;

            aggregation.values[time] = d;

            //return d;
          });

          // Assuming we only aggregate var_x, var_y, var_r
          leaves.forEach(function(d, i) {

            vars.time.points.forEach(function(time, i) {

              if(vars.var_x !== vars.time.var_time) {
                aggregation.values[time][vars.var_x] += d.values[time][vars.var_x];
              }

              if(vars.var_y !== vars.time.var_time) {
                aggregation.values[time][vars.var_y] += d.values[time][vars.var_y];
              }

              aggregation.values[time][vars.var_r] += d.values[time][vars.var_r];

            });

          });

          vistk.utils.init_item(aggregation);

          // Set internal attributes specific to aggregate + force redraw
          aggregation.__aggregated = true;
          aggregation.__redraw = true;

          vars.columns.forEach(function(c) {

            // Do no aggreagete ordinal values
            if(c === vars.var_text || c === vars.var_group) {
              return;
            }

            aggregation[c] = d3.mean(leaves, function(d) {
              return d[c];
            });

          });

          return aggregation;
        })
        .entries(data);

}
