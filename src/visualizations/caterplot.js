vars.default_params['caterplot'] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_items = function(d) { return d; };

  params.x_scale = [{
    func: d3.scale.ordinal()
            .rangeBands([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(d3.set(vars.new_data.map(function(d) {
              return d[scope.var_x];
            })).values())
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(vars.new_data, function(d) {
              return d[scope.var_y];
            })).nice()
  }];

  params.r_scale = d3.scale.linear()
              .range([scope.radius_min, scope.radius_max])
              .domain(d3.extent(vars.new_data, function(d) {
                return d[scope.var_r];
              }));

  params.items = [{
    marks: [{
    type: 'circle',
    r_scale: d3.scale.linear()
                .range([scope.radius_min, scope.radius_max])
                .domain(d3.extent(vars.new_data, function(d) { return d[scope.var_r]; })),
    fill: function(d) {
      return scope.color(scope.accessor_items(d)[scope.var_color]);
    },
   // translate: function() {
   //   return [vars.x_scale[0]['func'].rangeBand() / 4, 0]
   // },
     }, {
      var_mark: '__highlighted',
      type: d3.scale.ordinal().domain([true, false]).range(['text', 'none'])
    }, {
      var_mark: '__selected',
      type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
      translate: function(d) {
        return [10, -20];
      }
    }]
  }];

  params.connect = [];

  params.x_axis_show = true;
  params.x_axis_translate = [0, scope.height - scope.margin.bottom - scope.margin.top];
  params.x_grid_show = true;
  params.x_ticks = 10;

  params.y_axis_show = true;
  params.y_axis_translate = [scope.margin.left, 0];
  params.y_grid_show = true;
  params.y_invert = false;

  return params;

};
