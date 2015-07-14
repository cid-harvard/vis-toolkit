vars.default_params["stackedbar"] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.height/2, scope.height/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[scope.var_x]; })])
            .nice()
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain([d3.max(vars.new_data, function(d) { return d[vars.var_height] + d['y0']; }), 0])
  }];

  params.items = [{
    attr: "bar",
    marks: [{
      type: "rect",
      x: function() { return -vars.mark.width/2; },
      y: 0,
      height: function(d) { return params.y_scale[0]["func"](d[vars.var_height]) -10; },
      width: function(d) { return vars.mark.width*10; },
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
