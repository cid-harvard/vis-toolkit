vars.default_params['piechart'] = function(scope) {

  var params = {};

  scope.radius_min = 20;
  scope.radius_max = 100;

  if(vars.init) {

    scope.pie = d3.layout.pie().value(function(d) {
      return d[scope.var_share];
    })

    if(typeof scope.var_sort === 'undefined') {
      scope.pie.sort(null);
    } else {
      scope.pie.sort(function(a,b) {
        return a[scope.var_sort] - b[scope.var_sort];
      });
    }

    scope.new_data = scope.pie(scope.new_data.filter(function(d) {
      return true;
      // WIP to ,ake sure we don't
      //if(typeof visualization.params().set.__aggregated !== 'undefined' && visualization.params().set.__aggregated) {
      //  return d.__aggregated;
      //} else {
      //  return true;
      //}

    }));

    // Make sure the .data are available for the items
    scope.new_data.forEach(function(d) {
      d.values = d.data.values;
      d[scope.var_id] = d.data[scope.var_id];
      d[scope.var_x] = d.data[scope.var_x];
      d[scope.var_y] = d.data[scope.var_y];
      d[scope.var_group] = d.data[scope.var_group];
      d[scope.var_share] = d.data[scope.var_share];
      d.__aggregated = d.data.__aggregated;

    // Force redrawing items
      d.__redraw = true;
    });

  }

  // Identity scale
  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.width/2, scope.width/2])
  }];

  // Identity scale
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
