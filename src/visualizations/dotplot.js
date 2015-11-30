vars.default_params["dotplot"] = function(scope) {

  var params = {};

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width-scope.margin.left-scope.margin.right])
            .domain(d3.extent(vars.new_data, function(d) {
              return scope.accessor_data(d)[vars.var_x];
            }))
            .nice()
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.height/2, scope.height/2])
            .domain(d3.extent(vars.new_data, function(d) {
              return scope.accessor_data(d)[vars.var_y];
            }))
            .nice()
  }];

  params.items = [{
    attr: "name",
    marks: [{
      type: "circle",
    },{
      type: "text",
      rotate: "-90"
    }]
  }];

  params.x_axis_show = true;
  params.x_tickValues = [params.x_scale[0]["func"].domain()[0], params.x_scale[0]["func"].domain()[1]];
  params.x_axis_translate = [0, scope.height/2];

  params.y_axis_show = false;

  return params;

};
