vars.default_params["grid"] = function(scope) {

  var params = {};
  params.accessor_data = function(d) { return d; };

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
          .domain([0, Math.ceil(Math.sqrt(vars.new_data.length))])
          .range([0, scope.width])
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
          .domain([0, Math.ceil(Math.sqrt(vars.new_data.length))])
          .range([0, scope.height])
  }];

  params.items = [{
    attr: "name",
    marks: [{
      type: "diamond",
      rotate: "0"
    }, {
      type: "text",
      rotate: "-30"
    }]
  }];

  params.var_x = "grid_x";
  params.var_y = "grid_y";

  params.x_axis_show = false;
  params.y_axis_show = false;

  return params;

};
