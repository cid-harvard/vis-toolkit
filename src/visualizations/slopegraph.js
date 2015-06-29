vars.default_params["slopegraph"] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.margin.left, vars.width - vars.margin.left - vars.margin.right])
            .domain(vars.time.interval)
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.height - vars.margin.top - vars.margin.bottom, vars.margin.top])
            .domain(d3.extent(Array.prototype.concat.apply([], vars.new_data.map(function(d) { return d.values; }) ), function(d) { return d[vars.var_y]; }))
  }];

  params.items = [{
    attr: "name",
    marks: [{
      type: "rect",
      rotate: "0",
      fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
    }, {
      type: "text", // Text on the right (newest)
      rotate: "0"
    }, {
      type: "text", // Text on the left (oldest)
      rotate: "0",
      text_anchor: "end",
      translate: [-(vars.width-vars.margin.left-vars.margin.right-vars.margin.left+20), 0]
    }]
  }];

  params.connect = [{
    attr: vars.time.var_time,
    marks: [{
      type: "path",
      rotate: "0",
      stroke: function(d) { return "black"; },
      func: d3.svg.line()
           .interpolate(vars.interpolate)
           .x(function(d) { return vars.x_scale[0]["func"](d[vars.var_x]); })
           .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); }),
    }]
  }];

  params.x_ticks = vars.time.points.length;
  params.x_tickValues = vars.time.interval;
  params.x_axis_orient = "top";
  params.x_axis_show = true;
  params.x_grid_show = false;
  params.x_text = false;

  params.y_axis_show = false;
  params.y_grid_show = false;

  return params;

};
