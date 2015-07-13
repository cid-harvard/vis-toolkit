vars.default_params["slopegraph"] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_items = function(d) { return d.values; };

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
    attr: "right_label",
    marks: [{
      type: "text",
      text_anchor: "start"
    }]
  }, {
    attr: "left_label",
    accessor_data: function(d) {
      console.log("DD", d)
      var r = d.values.filter(function(e) {
        return e.year == "2003";
      })[0];
      return r;
    },
    marks: [{
      type: "text",
      text_anchor: "end",
      translate: [- 20, 0]
      // translate: [-(scope.width-scope.margin.left-scope.margin.right-scope.margin.left+20), 0]
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
