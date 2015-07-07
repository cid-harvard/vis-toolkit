vars.default_params["treemap"] = function(scope) {

  var params = {};

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain([0, d3.max(vars.new_data, function(d) { return d.x; })]),
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
            .domain([0, d3.max(vars.new_data, function(d) { return d.y; })]),
  }];

  params.items = [{
    attr: "bar",
    marks: [{
      type: "divtext",
      filter: function(d, i) { return d.depth == 1 && d.dx > 30 && d.dy > 30; }
    }, {
      type: "rect",
      rotate: "10",
      filter: function(d, i) { return d.depth == 2; },
      x: 0,
      y: 0,
      width: function(d) { return d.dx; },
      height: function(d) { return d.dy; }
    }]
  }];

  params.var_x = 'x';
  params.var_y = 'y';

  return params;

};
