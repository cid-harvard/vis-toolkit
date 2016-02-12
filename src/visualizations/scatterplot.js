vars.default_params['scatterplot'] = function(scope) {

  var params = {};

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(d3.extent(vars.new_data, function(d) {
              return scope.accessor_data(d)[scope.var_x];
            })).nice()
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(vars.new_data, function(d) {
              return scope.accessor_data(d)[scope.var_y];
            })).nice()
  }];

  params.r_scale = d3.scale.sqrt()
              .range([scope.radius_min, scope.radius_max])
              .domain(d3.extent(vars.new_data, function(d) {
                return scope.accessor_data(d)[scope.var_r];
              }));

  params.items = [{
    marks: [{
        type: 'circle',
        r_scale: d3.scale.linear()
                    .range([scope.radius_min, scope.radius_max])
                    .domain(d3.extent(vars.new_data, function(d) {
                      return scope.accessor_data(d)[scope.var_r];
                    })),
        fill: function(d) {
          return vars.color(vars.accessor_data(d)[scope.var_color]);
        }
      }, {
      var_mark: '__highlighted',
      type: d3.scale.ordinal().domain([true, false]).range(['text', 'none'])
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
