vars.default_params["stackedbar"] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.height/2, scope.height/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[scope.var_y]; })])
            .nice()
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(vars.new_data, function(d) { return d[scope.var_y]; })).nice()
  }];

  params.items = [{
    attr: "bar",
    marks: [{
      type: "rect",
      rotate: "0",
      x: function() { return -vars.mark.width/2; },
      y: function(d) { return - params.y_scale[0]["func"](d[vars.var_y]) + (scope.height - scope.margin.bottom - scope.margin.top - params.y_scale[0]["func"](d[scope.var_y])); },
      height: function(d) { return params.y_scale[0]["func"](d[scope.var_y]); },
      width: function(d) { return vars.mark.width*5; },
      fill: function(d) { return scope.color(scope.accessor_items(d)[scope.var_color]); }
    }]
  }];

  params.x_axis_show = true;
  params.x_axis_translate = [0, scope.height - scope.margin.bottom - scope.margin.top];
  params.x_grid_show = false;

  params.y_axis_show = true;
  params.y_axis_translate = [scope.margin.left, 0];
  params.y_grid_show = true;

  return params;

};

