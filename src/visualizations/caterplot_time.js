vars.default_params['caterplot_time'] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_items = function(d) { return d; };

  params.accessor_data = function(d) {
    return d.values[vars.time.current_time];
  };

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(vars.time.interval)
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(vars.all_data, function(d) {
              return d[scope.var_y];
            })).nice()
  }];

  params.r_scale = d3.scale.linear()
              .range([scope.radius_min, scope.radius_max])
              .domain(d3.extent(vars.new_data, function(d) {
                return d[scope.var_r];
              }));


  params.items = [];

  scope.time.points.forEach(function(time, i) {

    var item = {
      marks: [{
        type: 'circle',
        r_scale: d3.scale.linear()
                  .range([scope.radius_min, scope.radius_max])
                  .domain(d3.extent(vars.new_data, function(d) { return d[scope.var_r]; })),
        fill: function(d) {
          return scope.color(scope.accessor_items(d)[scope.var_color]);
        }
      }],
      accessor_data: function(d) {
        return d.values.filter(function(e) {
          return e.year == time;
        })[0];
      }
    };

    if(i === scope.time.points.length - 1) {

      item.marks.push({
        var_mark: '__highlighted',
        type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
        translate: [20, 0]
      });

      item.marks.push({
        var_mark: '__selected',
        type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
        translate: [20, 0]
      });

    }

    params.items.push(item);

  });

  params.connect = [{
    marks: [{
      var_mark: ['__highlighted', '__selected'],
      type: d3.scale.ordinal().domain([true, false]).range(['path', 'none']),
      stroke: function(d) {
        return vars.color(params.accessor_data(d)[vars.var_color]);
      },
      fill: function(d) {
        return 'none';
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
