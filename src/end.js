
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

vistk.utils.find_node_coordinates_by_id = function(nodes, id) {

  var res = nodes.filter(function(d) {
    return d.id == id;
  })[0];

  // If we can't find product in the graph, put it in the corner
  if(typeof res == "undefined") {
    // res = {x: 500+Math.random()*400, y: 1500+Math.random()*400};
     res = {x: 1095, y: 1675};
  }

  return res;
} 
