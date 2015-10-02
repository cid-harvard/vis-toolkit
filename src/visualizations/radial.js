vars.default_params["radial"] = function(scope) {

  var params = {};

  params.var_x = 'x';
  params.var_y = 'y';

  //if(vars.refresh) {

    utils.create_hierarchy(scope);

    var diameter = 960;

    var tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    vars.nodes = tree.nodes(vars.root);
    vars.links = tree.links(vars.nodes);

    vars.new_data = vars.nodes;

    vars.new_data.forEach(function(d) { d.__redraw = true; });
    vars.links.forEach(function(d) { d.__redraw = true; });

 // }

  params.x_scale = [{
    func: d3.scale.linear()
            .range([0, scope.width-scope.margin.left-scope.margin.right])
            .domain(d3.extent(vars.new_data, function(d) { return d.x; })).nice()
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.height-scope.margin.top-scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(vars.new_data, function(d) { return d.y; })).nice(),
  }];

  params.r_scale = d3.scale.linear()
              .range([10, 30])
              .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; }));

  params.connect = [{
    attr: "links",
    type: "items",
    marks: [{
      type: "line",
      rotate: "0",
      func: null,
    }]
  }];
/*
  params.connect = [{
    attr: vars.time.var_time,
    marks: [{
      type: "path",
     // fill: function(d) { return vars.color(params.accessor_items(d)[vars.var_color]); },
      stroke: function(d) {
        return "black";
      },
      func: diagonal
    }]
  }];
*/
  params.items = [{
    marks: [{
      type: "text",
  //    rotate: function(d) { return d.x - 90; },
  //      translate: function(d) { return [d.y, 0]; }
  //    filter: function(d, i) { return d.depth == 1 && d.dx > 30 && d.dy > 30; }
    }, {
      type: "circle",
 //     filter: function(d, i) { return d.depth == 2; },
      r: 10,
      x: 0,
      y: 0,
   //   rotate: function(d) { return d.x - 90; },
   //   translate: function(d) { return [d.y, 0]; }
    }]
  }];


  return params;

};
