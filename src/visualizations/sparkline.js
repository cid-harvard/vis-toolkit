vars.default_params["sparkline"] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(scope.time.interval)
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
            .domain(d3.extent(Array.prototype.concat.apply([], vars.new_data.map(function(d) {
              return d3.values(d.values);
            })), function(d) {
              return d[vars.var_y];
            }))
  }];

  params.items = [{
    marks: [{
      type: "circle",
      rotate: "0",
    }, {
      type: "text",
      rotate: "0",
      translate: [-20, 0],
      text_anchor: "end"
    }]
  }];

  params.connect = [{
    attr: scope.time.var_time,
    marks: [{
      type: "path",
      rotate: "0",
      stroke: function(d) { return "black"; },
      func: d3.svg.line()
           .interpolate(scope.interpolate)
           .x(function(d) { return params.x_scale[0]["func"](d[scope.var_x]); })
           .y(function(d) { return params.y_scale[0]["func"](d[scope.var_y]); }),
      fill: 'none'
    }]
  }];

  params.x_axis_show = false;
  params.x_grid_show = false;

  params.y_axis_show = false;
  params.y_grid_show = false;

  return params;

};
