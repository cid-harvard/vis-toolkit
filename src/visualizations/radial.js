vars.default_params['radial'] = function(scope) {

  var params = {};

  params.var_x = 'x2';
  params.var_y = 'y2';

  params.diameter = vars.diameter || 360;

  scope.accessor_data = function(d) { return d; }

  if(vars.init || vars.refresh) {

    utils.create_hierarchy(scope);

    vars.tree = d3.layout.tree()
        .size([360, params.diameter - 120])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    vars.diagonal = d3.svg.diagonal.radial()
        .source(function(d) { return {"x": d[0].x, "y": d[0].y}; })
        .target(function(d) { return {"x": d[1].x, "y": d[1].y}; })
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    vars.nodes = vars.tree.nodes(vars.root);
    vars.links = vars.tree.links(vars.nodes);

    vars.new_data = vars.nodes;

    // In case we want to build an array with temporal values
    vars.new_data.forEach(function(d) {
      // Required for items
      d.x2 = scope.width / 2;
      d.y2 = scope.height / 2;
      d.__redraw = true;
    });

    vars.links.forEach(function(d) {
      d.__redraw = true;
    });

  }

  params.x_scale = vistk.utils.scale.linear(scope);
  params.y_scale = vistk.utils.scale.linear(scope);

  params.r_scale = d3.scale.linear()
                      .range([vars.radius_min, vars.radius_max])
                      .domain(d3.extent(vars.new_data, function(d) {
                        return vars.accessor_data(d)[vars.var_r];
                      }));

  params.items = [{
    marks: [{
      type: 'text',
      rotate_first: true,
      translate: function(d) {
        return [d.y, 0];
      },
      rotate: function(d) {
        return (d.x - 90);
      },

    }, {
      type: 'circle',
      r: 10,
      rotate_first: true,
      translate: function(d) {
        return [d.y, 0];
      },
      rotate: function(d) {
        return (d.x - 90);
      }
    }],

   // In case we want to override the marks with groups position
   //enter: function(data, vars) {
   //  // attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
   //  this.attr("transform", function(d, i) {
   //    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ", 0)";
   //  })
   //},
   //update: function(data, vars) {
   //  // attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
   //  this.attr("transform", function(d, i) {
   //    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ", 0)";
   //  })
   //}
  }];

  params.connect = [{
    attr: vars.time.var_time,
    marks: [{
      type: 'path_coord',
     // type: 'line',
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
