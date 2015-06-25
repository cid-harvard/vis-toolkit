vars.default_params["linechart"] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };

  params.x_scale = [{
      name: "linear",
      func: d3.scale.linear()
              .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
              .domain(vars.time.interval)
  }]

  params.y_scale = [{
      name: "linear",
      func: d3.scale.linear()
              .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
              .domain(d3.extent(Array.prototype.concat.apply([], vars.new_data.map(function(d) { return d.values; }) ), function(d) { return d[vars.var_y]; }))
  }];

  params.items = [{
    attr: "year",
    marks: [{
      type: "circle",
      rotate: "0",
      fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
    },{
      type: "text",
      rotate: "0"
    }]
  }];

  params.connect = [{
    attr: vars.time.var_time,
    type: "time",
    marks: [{
      type: "path",
      rotate: "0",
      stroke: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); },
      func: d3.svg.line()
           .interpolate(vars.interpolate)
           .x(function(d) { return params.x_scale[0]["func"](d[vars.var_x]); })
           .y(function(d) { return params.y_scale[0]["func"](d[vars.var_y]); }),
    }]
  }];

  params.x_ticks = vars.time.points.length;
  params.x_tickValues = null;
  params.x_axis_orient = "top";
  params.x_axis_show = true;
  params.x_grid_show = true;
  params.x_text = false

  params.y_axis_show = false
  params.y_grid_show = false;

  return params;
};
