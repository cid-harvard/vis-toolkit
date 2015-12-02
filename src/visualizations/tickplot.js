vars.default_params["tickplot"] = function(scope) {

  var params = {};

  params.items = [];

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(d3.extent(vars.new_data, function(d) {
              return scope.accessor_data(d)[vars.var_x];
            })).nice()
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(vars.new_data, function(d) {
              return scope.accessor_data(d)[vars.var_y];
            })).nice()
  }];

  scope.time.points.forEach(function(time) {

    var item = {};
    item.marks = [];
    // Draw items with a specific filter
    var mark = [{
        type: "rect",
        rotate: 90
      }];

    item.marks[0] = mark;

    item.accessor_data = function(d) {
      return d.values.filter(function(e) {
        return e.year == time;
      })[0];
    };

    params.items = params.items.concat(item);

  });

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
