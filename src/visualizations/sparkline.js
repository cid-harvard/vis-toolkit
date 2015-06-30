vars.default_params["sparkline"] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_data = function(d) { return d; };

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(scope.time.interval)
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
              .domain(d3.extent(Array.prototype.concat.apply([], vars.new_data.map(function(d) { return d.values; }) ), function(d) { return d[vars.var_y]; }))
  }];

  params.items = [{
    attr: "year",
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
      }]
  }];

  params.x_axis_show = false;

  params.y_axis_show = false;

  return params;

};
