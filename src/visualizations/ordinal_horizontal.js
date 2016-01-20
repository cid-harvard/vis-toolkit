vars.default_params["ordinal_horizontal"] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.ordinal()
            .domain(d3.set(vars.new_data.map(function(d) {
              return scope.accessor_data(d)[vars.var_x];
            })).values())
            .rangeBands([scope.margin.left, scope.width - scope.margin.left - scope.margin.right]),
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.height/2, scope.height/2])
            .domain([0, d3.max(vars.new_data, function(d) {
              return d[scope.var_y];
            })])
            .nice()
  }];

  params.items = [{
    marks: [{
      type: "circle"
    },{
      type: "text"
    }]
  }];

  params.connect = [];

  params.x_axis_show = false;

  params.y_axis_show = false;

  return params;

}
