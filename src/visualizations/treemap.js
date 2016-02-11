vars.default_params['treemap'] = function(scope) {

  var params = {};

  if(vars.init) {

    // If no group is set, then each item is its own group
    if(typeof vars.var_group === 'undefined' || vars.var_group === null) {
      vars.var_group = vars.var_id;
    }

    if(vars.var_group === vars.var_id) {
      vars.var_group = '_index_item';
    }

  }

  if(vars.refresh) {

    utils.create_hierarchy(scope);

    vars.layout.treemap = d3.layout.treemap()
        .padding(scope.treemap.padding)
        .sticky(true)
        .sort(function(a,b) { return a[scope.var_sort] - b[scope.var_sort]; })
        .size([scope.width - scope.margin.left - scope.margin.right, scope.height - scope.margin.top - scope.margin.bottom])
        .mode(scope.treemap_mode)
        .value(function(d) {
          if(typeof scope.accessor_data(d)[vars.var_size] === 'function') {
            return scope.accessor_data(d)[vars.var_size](d);
          } else {
            return scope.accessor_data(d)[vars.var_size];
          }
        });

    vars.new_data = vars.layout.treemap.nodes(vars.root);

    // Since we generated new data, need to redraw
    vars.new_data.forEach(function(d) {
      d.__redraw = true;
    });

  }

  // Identity scale
  params.x_scale = vistk.utils.scale.linear(scope);

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
            .domain([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom]),
  }];

  params.items = [{
    marks: [{
      type: 'divtext',
      filter: function(d, i) { return d.depth == vars.treemap.depth_text && d.dx > vars.treemap.dx && d.d_y >  vars.treemap.d_y; }
    }, {
      type: 'rect',
      filter: function(d, i) { return d.depth == vars.treemap.depth_rect; },
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
