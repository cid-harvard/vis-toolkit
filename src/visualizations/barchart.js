vars.default_params["barchart"] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.ordinal()
            .rangeRoundBands([scope.margin.left, scope.width - scope.margin.left - scope.margin.right], .1)
            .domain(vars.new_data.map(function(d) { return d[scope.var_x]; }))
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
      x: function() { return -scope.mark.width/2; },
      y: function(d) { return -scope.margin.top; },
      height: function(d) { return scope.height - scope.margin.bottom - scope.margin.top - params.y_scale[0]["func"](d[scope.var_y]); },
      width: function(d) { return params.x_scale[0]["func"].rangeBand(); },
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
