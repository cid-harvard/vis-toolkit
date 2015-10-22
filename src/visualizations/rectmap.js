vars.default_params["rectmap"] = function(scope) {

  var params = {};


  params.x_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.margin.left])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_width]; })])
  }];

  params.y_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_height]; })])
  }];

  params.width_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_width]; })])
  }];

  params.height_scale = [{
    func: d3.scale.linear()
            .range([scope.margin.top, scope.height - scope.margin.top - scope.margin.bottom])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_height]; })])
  }];


  if(vars.init) {

    vars.new_data.forEach(function(d) {
      d.x = 0;
      d.y = 0;
      d.dx = params.width_scale[0]["func"](d[vars.var_width]);
      d.dy = params.width_scale[0]["func"](d[vars.var_height]);
    });

  }

  params.items = [{
    marks: [{
     type: "text",
     x: function(d) { return params.width_scale[0]["func"](d[vars.var_width]); },
     y: function(d) { return params.height_scale[0]["func"](d[vars.var_height]) - 10; },
     text_anchor: "end"
   //  filter: function(d, i) { return d.depth == vars.treemap.depth_text && d.dx > vars.treemap.dx && d.d_y >  vars.treemap.d_y; }
   }, {
      type: "rect",
   //   filter: function(d, i) { return d.depth == vars.treemap.depth_rect; },
      x: 0,
      y: 0,
      width: function(d) { return params.width_scale[0]["func"](d[vars.var_width]); },
      height: function(d) { return params.height_scale[0]["func"](d[vars.var_height]); }
    }]
  }];

  params.var_x = 'x';
  params.var_y = 'y';

  return params;

};
