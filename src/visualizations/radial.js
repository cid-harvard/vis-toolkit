vars.default_params['radial'] = function(scope) {

  var params = {};

  params.var_x = 'x';
  params.var_y = 'y';

  scope.accessor_data = function(d) { return d; }

  if(vars.init || vars.refresh) {

    utils.create_hierarchy(scope);

    vars.tree = d3.layout.tree()
        .size([360, scope.width / 3 - 120])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    vars.diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    vars.nodes = vars.tree.nodes(vars.root);
    vars.links = vars.tree.links(vars.nodes);

    vars.new_data = vars.nodes;

    // In case we want to build an array with temporal values
    vars.new_data.forEach(function(d) {

    //  d.values = [];
    //  d.values[vars.time.current_time] = {};
    //  d.values[vars.time.current_time][vars.var_id] = d[vars.var_id];
    //  d.values[vars.time.current_time][vars.var_x] = d[vars.var_x];
    //  d.values[vars.time.current_time][vars.var_y] = d[vars.var_y];
    //  d.values[vars.time.current_time][vars.var_text] = d[vars.var_text];

      d.__redraw = true;
    });

    vars.links.forEach(function(d) {
      d.__redraw = true;
    });

  }

  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width-scope.margin.left-scope.margin.right])
            .domain(d3.extent(vars.new_data, function(d) { return d.x; })).nice()
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.top, scope.height-scope.margin.top-scope.margin.bottom])
            .domain(d3.extent(vars.new_data, function(d) { return d.y; })).nice(),
  }];

  params.r_scale = d3.scale.linear()
                      .range([vars.radius_min, vars.radius_max])
                      .domain(d3.extent(vars.new_data, function(d) {
                        return vars.accessor_data(d)[vars.var_r];
                      }));

  params.items = [{
    marks: [{
      type: 'text',
      translate: function(d) {
        if(d.depth === 2) {
          return [0, 20];
        } else {
          return [10, -params.r_scale(d[vars.var_r]) - 10];
        }
      },
      rotate: function(d) {
        if(d.depth === 2) {
          return 45;
        } else {
          return 0;
        }
      }
    }, {
      type: 'circle',
      r: 10
    }]
  }];

  params.connect = [{
    attr: vars.time.var_time,
    marks: [{
      type: 'path',
      type: 'line',
     // fill: function(d) { return vars.color(params.accessor_items(d)[vars.var_color]); },
      stroke: function(d) {
        return 'black';
      },
      func: vars.diagonal,
      translate: [scope.width / 2, scope.height / 2]
    }]
  }];

  return params;

};
