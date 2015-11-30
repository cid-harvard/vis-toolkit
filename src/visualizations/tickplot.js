vars.default_params["tickplot"] = function(scope) {

  var params = {};

  params.accessor_values = function(d) { return d.values; };
  params.accessor_items = function(d) { return d; };

  params.items = [];
  params.items.marks = [];
  console.log("totot")
  scope.time.points.forEach(function(time) {

    // Draw items with a specific filter
    var mark = [{
        type: "tick",
      }, {
        type: "text"
      }, {
        accessor_data: function(d) {
          return d.values.filter(function(e) {
            return e[vars.time.var_time] == time;
          })[0];
        }
      }];
      console.log("Adding", mark)
    params.items.marks.push(mark);

  });

  params.connect = [{
    marks: [{
      type: "path",
      stroke: function(d) {
        return vars.color(params.accessor_items(d)[vars.var_color]);
      },
      func: d3.svg.line()
           .interpolate(vars.interpolate)
           .x(function(d) { return params.x_scale[0]["func"](d[vars.var_x]); })
           .y(function(d) { return params.y_scale[0]["func"](d[vars.var_y]); }),
      fill: "none"
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
  params.y_invert = true;

  return params;

};
