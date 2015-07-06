vars.default_params["ordinal_horizontal"] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.ordinal()
            .domain(d3.set(vars.new_data.map(function(d) { return d[vars.var_x]; })).values())
            .rangeBands([vars.margin.left, vars.width - vars.margin.left - vars.margin.right]),

  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })])
            .range([vars.height/2, vars.height/2])
            .nice()
  }];

  params.items = [{
    attr: "name",
    marks: [{
      type: "circle",
      rotate: "0",
    },{
      type: "text",
      rotate: "0"
    }]
  }];

  params.connect = [];

  params.x_axis_show = false;

  params.y_axis_show = false;

  return params;

}
