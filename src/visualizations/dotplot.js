vars.default_params["dotplot"] = function(scope) {

  var params = {};

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width-scope.margin.left-scope.margin.right])
            .domain([0, d3.max(vars.new_data, function(d) { return d[scope.var_x]; })])
            .nice()
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.height/2, scope.height/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[scope.var_y]; })])
            .nice()
  }];

  params.items = [{
    attr: "name",
    marks: [{
      type: "circle",
      rotate: "0"
    },{
      type: "text",
      rotate: "-90"
    }]
  }];

  params.x_axis_show = true;
  params.x_tickValues = [0, d3.max(vars.new_data, function(d) { return d[scope.var_x]; })];
  params.x_axis_translate = [0, scope.height/2];

  params.y_axis_show = false;

  return params;

};
