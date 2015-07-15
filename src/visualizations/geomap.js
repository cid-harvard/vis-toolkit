 vars.default_params["geomap"] = function(scope) {

  var params = {};

  params.accessor_data = function(d) { return d.data; };
  params.accessor_values = function(d) { return d.data.values; };

  params.x_scale = [{
    func: d3.scale.linear()
            .domain(d3.extent(vars.countries, function(d) { return d[vars.var_x]; }))
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .domain(d3.extent(vars.countries, function(d) { return d[vars.var_y]; }))
            .range([scope.height - vars.margin.top - vars.margin.bottom, scope.margin.top])
  }];

  params.items = [{
    marks: [{
      type: "shape",
      fill: d3.scale.linear()
              .domain([d3.min(vars.new_data, function(d) { 
                  return d[vars.var_color]; 
                }), d3.max(vars.new_data, function(d) { 
                  return d[vars.var_color]; 
                })])
              .range(["red", "green"])
    }]
  }];

  return params;

};
