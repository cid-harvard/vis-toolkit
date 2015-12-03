vars.default_params["stacked"] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_items = function(d) { return d; };


  // Chart specific metadata: stacked
  if(vars.refresh) {

    // Make sure all items and all ranks are there
    vars.new_data.forEach(function(c) {

      vars.time.points.forEach(function(y) {
        var is_year = false;

        c.values.forEach(function(v) {

          if(v[vars.time.var_time] == y) {
            is_year = true;
          }
        });

        if(!is_year) {

          // Set missing values to null
          var v = {date: y, year: y};

          v[vars.time.var_time] = y;
          v[vars.var_y] = 0;
          c.values.push(v);

        }

      });

    });

    vars.stack = d3.layout.stack()
        .values(function(d) { return d3.values(d.values); })
        .x(function(d) { return d[vars.time.var_time]; })
        .y(function(d) { return d[vars.var_y]; });

     vars.new_data = vars.stack(vars.new_data);
  }

  params.x_scale = [{
    func: d3.time.scale()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(vars.time.interval)
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(Array.prototype.concat.apply([], vars.new_data.map(function(d) {
              return d3.values(d.values);
            })), function(d) {
              return d.y + d.y0;
            }))
  }];

  params.connect = [{
    attr: vars.time.var_time,
    marks: [{
      type: "path",
      fill: function(d) { return vars.color(params.accessor_items(d)[vars.var_color]); },
      stroke: function(d) {
        return "black";
      },
      func: d3.svg.area()
              .interpolate('cardinal')
              .x(function(d) { return params.x_scale[0]["func"](d[vars.time.var_time]); })
              .y0(function(d) { return params.y_scale[0]["func"](d.y0); })
              .y1(function(d) { return params.y_scale[0]["func"](d.y0 + d.y); })
    }]
  }];

  params.x_axis_show = true;
  params.x_axis_translate = [0, scope.height - scope.margin.bottom - scope.margin.top];
  params.x_grid_show = true;
  params.x_ticks = vars.time.points.length;
  params.x_format = d3.time.format("%Y");
  params.x_text = false;

  params.y_axis_show = true;
  params.y_axis_translate = [scope.margin.left, 0];
  params.y_grid_show = true;

  return params;

};
