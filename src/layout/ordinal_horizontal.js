vars.default_layout["ordinal_horizontal"] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.ordinal()
            .domain(d3.set(vars.new_data.map(function(d) { return d[vars.var_x]; })).values())
            .rangeBands([scope.margin.left, scope.width - scope.margin.left - scope.margin.right]),
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.height/2, scope.height/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[scope.var_y]; })])
            .nice()
  }];

  return params;

}
