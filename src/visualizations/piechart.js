vars.default_params['piechart'] = function(scope) {

  var params = {};

  scope.radius_min = 20;
  scope.radius_max = 100;

  if(vars.init) {

    scope.pie = d3.layout.pie().value(function(d) {
      return d[scope.var_share];
    })
    .sort(null); // Disable sorting for pie charts

    scope.new_data = scope.pie(scope.new_data);

    scope.new_data.forEach(function(d) {
      d.values = d.data.values;
      d[scope.var_id] = d.data[scope.var_id];
      d[scope.var_x] = d.data[scope.var_x];
      d[scope.var_y] = d.data[scope.var_y];
      d[scope.var_group] = d.data[scope.var_group];
      d[scope.var_share] = d.data[scope.var_share];
      d.__aggregated = d.data.__aggregated;
    });

    scope.new_data.forEach(function(d) { d.__redraw = true; });

  }

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.width/2, scope.width/2])
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height/2, scope.height/2])
  }];

  params.r_scale = d3.scale.linear()
              .range([0, scope.width/6])
              .domain([0, d3.max(scope.new_data, function(d) {
                return scope.accessor_data(d)[scope.var_share];
              })]);

  params.items = [{
    marks: [{
      type: 'arc',
      fill: function(d) {
        return scope.color(scope.accessor_data(d)[scope.var_color]);
      }
    }]
  }];

  params.x_axis_show = false;
  params.x_grid_show = false;

  params.y_axis_show = false;
  params.y_grid_show = false;

  return params;

};
