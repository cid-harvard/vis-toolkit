vars.default_params['piechart'] = function(scope) {

  var params = {};

  if(vars.refresh) {

    scope.pie = d3.layout.pie().value(function(d) { return d[scope.var_share]; });
    scope.new_data = scope.pie(scope.new_data);

    scope.new_data.forEach(function(d) {
      d.values = d.data.values;
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
        return scope.color(scope.accessor_items(d)[scope.var_color]);
      }
    }]
  }];

  params.x_axis_show = false;
  params.x_grid_show = false;

  params.y_axis_show = false;
  params.y_grid_show = false;

  return params;

};
