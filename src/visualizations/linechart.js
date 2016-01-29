vars.default_params["linechart"] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_data = function(d) { return d; };

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(vars.time.interval)
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(Array.prototype.concat.apply([], vars.new_data.map(function(d) {
              return d3.values(d.values);
            })), function(d) {
              return d[vars.var_y];
            }))
  }];

  params.items = [{
    marks: [{
      type: 'circle',
      fill: function(d) {
        return vars.color(params.accessor_data(d)[vars.var_color]);
      }
    }, {
      var_mark: '__highlighted',
      type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
      translate: [10, 0],
      text: function(d) {
        return scope.accessor_data(d)[vars.var_y] + ' ' + d[vars.var_text];
      }
    }, {
      var_mark: '__selected',
      type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
      translate: [10, 0],
      text: function(d) {
        return scope.accessor_data(d)[vars.var_y] + ' ' + d[vars.var_text];
      }
    }],
    accessor_data: function(d) {
      return d.values.filter(function(e) {
        return e[vars.time.var_time] == vars.time.current_time;
      })[0];
    }
  }];

  params.connect = [{
    marks: [{
      type: 'path',
      stroke: function(d) {
        return vars.color(params.accessor_data(d)[vars.var_color]);
      },
      func: d3.svg.line()
           .interpolate(vars.interpolate)
           .x(function(d) {
             return params.x_scale[0]['func'](vars.time.parse(d[vars.var_x]));
           })
           .y(function(d) {
             return params.y_scale[0]['func'](d[vars.var_y]);
           })
    }]
  }];

  params.x_ticks = vars.time.points.length;
  params.x_tickValues = null;
  params.x_axis_orient = "top";
  params.x_axis_show = true;
  params.x_grid_show = true;
  params.x_text = false;

  params.y_axis_show = false
  params.y_grid_show = false;
  params.y_invert = false;

  return params;

};
