vars.default_params["ordinal_vertical"] = function(scope) {

  var params = {};

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.width/2, scope.width/2])
            .nice()
  }];

  params.y_scale = [{
    name: "index",
    func: d3.scale.ordinal()
            .domain(d3.set(vars.new_data.map(function(d) { return d[vars.var_y]; })).values())
            .rangeBands([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
  }];

  params.items = [{
    attr: "name",
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
