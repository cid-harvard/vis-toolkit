vars.default_params["caterplot"] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_items = function(d) { return d; };

  params.x_scale = [{
    func: d3.scale.ordinal()
            .rangeBands([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(d3.set(vars.new_data.map(function(d) { return d['community_name']; })).values())
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; })).nice()
  }];

  params.r_scale = d3.scale.linear()
              .range([vars.radius_min, vars.radius_max])
              .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; }));

  params.items = [{
    translate: function() {
      return [params.x_scale[0]['func'].rangeBand() / 2, 0]
    },
    marks: [{
        type: 'circle',
        r_scale: d3.scale.linear()
                    .range([vars.radius_min, vars.radius_max])
                    .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; })),
        fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); },
      }, {
      var_mark: '__highlighted',
      type: d3.scale.ordinal().domain([true, false]).range(['text', 'none'])
    }]
  }];

  params.connect = [{
    marks: [{
      type: "path",
      stroke: function(d) { return vars.color(params.accessor_items(d)[vars.var_color]); },
      func: d3.svg.line()
           .interpolate(vars.interpolate)
           .x(function(d) { return params.x_scale[0]["func"](d[vars.var_x]); })
           .y(function(d) { return params.y_scale[0]["func"](d[vars.var_y]); }),
      fill: "none"
    }]
  }];

  params.x_axis_show = true;
  params.x_axis_translate = [0, scope.height - scope.margin.bottom - scope.margin.top];
  params.x_grid_show = true;
  params.x_ticks = 10;

  params.y_axis_show = true;
  params.y_axis_translate = [scope.margin.left, 0];
  params.y_grid_show = true;

  return params;

};
