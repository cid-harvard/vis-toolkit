vars.default_params["treemap"] = function(scope) {

  var params = {};

  if(vars.init) {

    if(typeof vars.var_group === "undefined" || vars.var_group === null) {

      vars.var_group = vars.var_id;
    }
  }

  if(vars.refresh) {

    utils.create_hierarchy(scope);

    vars.treemap = d3.layout.treemap()
        .padding(vars.padding)
        .sticky(true)
        .sort(function(a,b) { return a[vars.var_sort] - b[vars.var_sort]; })
        .size([vars.width, vars.height])
        .value(function(d) { return d[vars.var_size]; });

    vars.new_data = vars.treemap.nodes(vars.root);

    vars.new_data.forEach(function(d) { d.__redraw = true; });

  }

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(d3.extent(vars.new_data, function(d) { return d.x; })),
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
            .domain(d3.extent(vars.new_data, function(d) { return d.y; })),
  }];

  params.items = [{
    marks: [{
      type: "divtext",
      filter: function(d, i) { return d.depth == 1 && d.dx > 30 && d.dy > 30; }
    }, {
      type: "rect",
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
