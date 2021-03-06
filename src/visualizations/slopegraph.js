vars.default_params['slopegraph'] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_items = function(d) { return d.values; };

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(scope.time.interval)
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(vars.new_data, function(d) {
              return scope.accessor_data(d)[scope.var_y];
            }))
  }];

  params.items = [{
    attr: 'right_label',
    marks: [{
      type: 'text',
      text_anchor: 'start'
    }]
  }, {
    attr: 'left_label',
    marks: [{
      type: 'text',
      text_anchor: 'end',
      translate: [- 20, 0]
      // translate: [-(scope.width-scope.margin.left-scope.margin.right-scope.margin.left+20), 0]
    }]
  }];

  params.connect = [{
    attr: scope.time.var_time,
    marks: [{
      type: 'path',
      fill: 'none',
      stroke: function(d) { return 'black'; },
      func: d3.svg.line()
           .interpolate(scope.interpolate)
           .x(function(d) { return vars.x_scale[0]["func"](d[scope.var_x]); })
           .y(function(d) { return vars.y_scale[0]["func"](d[scope.var_y]); }),
    }]
  }];

  params.x_ticks = scope.time.points.length;
  params.x_tickValues = scope.time.interval;
  params.x_axis_orient = 'top';
  params.x_axis_show = true;
  params.x_grid_show = false;
  params.x_text = false;

  params.y_axis_show = false;
  params.y_grid_show = false;

  return params;

};
