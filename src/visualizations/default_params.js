vars.default_params = {};

vars.default_params.basic = {};
vars.default_params.composite = {};
vars.default_params.custom = {};

// TODO
// There should be an abstract version of the dotplot
// And then decide weither it is horizontal or vertical
vars.default_params["dotplot"] = {
  x_scale: [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })])
            .nice()
  }, {
    name: "index",
    func: d3.scale.ordinal()
            .domain(d3.range(vars.new_data.length))
            .rangeBands([vars.margin.left, vars.width - vars.margin.left - vars.margin.right]),
    callback: function() {
                vars.new_data.sort(function ascendingKey(a, b) {
                  return d3.ascending(a[vars.var_x], b[vars.var_x]);
                })
                .forEach(function(d, i) {
                  d.rank = vars.x_scale[0]["func"](i);
                });
      }
    }
  ],

  y_scale: [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.height/2, vars.height/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })])
            .nice()
  }],

  items: [{
    attr: "name",
    marks: [{
      type: "circle",
      rotate: "0"
    },{
      type: "text",
      rotate: "-90"
    }]
  }],

  connect: [],

  axes: [
    {type: "x",
     scale: null}
  ],

  x_axis_show: true,
  x_tickValues: [0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })],
  x_axis_translate: [0, vars.height/2],
  y_axis_show: false
};

vars.default_params["dotplot_vertical"] = {
  x_scale: [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.width/2, vars.width/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })])
            .nice()
  }],

  y_scale: [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.margin.top, vars.height-vars.margin.top-vars.margin.bottom])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })])
            .nice()
  }],

  items: [{
    attr: "name",
    marks: [{
      type: "circle",
      rotate: "0"
    },{
      type: "text",
      rotate: "-90"
    }]
  }],

  connect: [],

  axes: [
    {type: "x",
     scale: null}
  ],

  x_axis_show: false,
  y_axis_show: true,
  y_tickValues: [0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })],
  y_axis_translate: [vars.width/2, 0],

};

vars.default_params["scatterplot"] = {

  x_scale: [{
      name: "linear",
      func: d3.scale.linear()
              .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
              .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_x]; })).nice()
    }, {
      name: "linear_sparkline",
      func: d3.scale.linear()
              .range([0, 100])
              .domain(d3.extent(vars.data, function(d) { return d[vars.time.var_time]; })).nice()
    }
  ],

  x_ticks: 10,

  y_scale: [{
      name: "linear",
      func: d3.scale.linear()
              .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
              .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; })).nice(),
    }, {
      name: "linear_sparkline",
      func: d3.scale.linear()
              .range([100, 0])
              .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; })).nice(),
    }
  ],

  r_scale: d3.scale.linear()
              .range([10, 30])
              .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; })),

  items: [{
    attr: "country",
    marks: [{
        type: "circle",
        rotate: "0",
        r_scale: d3.scale.linear()
                    .range([10, 30])
                    .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_r]; })),
        fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
      }, {
        type: "text",
        rotate: "30",
        translate: null
      }]
    }, {
    attr: "continent",
    marks: [{
        type: "circle",
        rotate: "0",
        radius: 20,
        fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
        // TODO: add specific r_scale
    }, {
        type: "text",
        rotate: "-30",
        translate: null
        // TODO: move away according to r_scale                
    }]
  }],

  connect: [],

  x_axis_show: true,
  x_axis_translate: [0, vars.height - vars.margin.bottom - vars.margin.top],
  x_grid_show: true,
  
  y_axis_show: true,
  y_axis_translate: [vars.margin.left, 0],
  y_grid_show: true
};


// vars.default_params["dotplot_vertical"].x_scale[0]["func"].domain(vars.default_params["dotplot_vertical"].y_scale[0]["func"].domain());
//vars.default_params["dotplot_vertical"].x_scale[0]["func"].range(vars.default_params["dotplot_vertical"].y_scale[0]["func"].domain());
vars.default_params["vertical_ordinal"] = {

  x_scale: [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.width/2, vars.width/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })])
            .nice()
  }],

  y_scale: [{
      name: "index",
      func: d3.scale.ordinal()
              .domain(d3.set(vars.new_data.map(function(d) { return d[vars.var_y]; })).values())
              .rangeBands([vars.margin.left, vars.width - vars.margin.left - vars.margin.right]),
      callback: function() {
                  vars.new_data.sort(function ascendingKey(a, b) {
                    return d3.ascending(a[vars.var_x], b[vars.var_x]);
                  })
                  .forEach(function(d, i) {
                    d.rank = vars.x_scale[0]["func"](i);
                  });
      }
    }
  ],

  items: [{
    attr: "name",
    marks: [{
      type: "circle",
      rotate: "0",
     // r_scale: d3.scale.linear()
     //             .range([10, 30])
     //             .domain(d3.extent(vars.new_data, function(d) { return d[params.var_r]; }))
    },{
      type: "text",
      rotate: "0"
    }]
  }],

  connect: [],

  x_axis_show: false,

  y_axis_show: false
};

vars.default_params["grid"] = {

  x_scale: [{
      name: "linear",
      func: d3.scale.linear()
            .domain([0, nb_dimension])
            .range([0, vars.width])
    }
  ],

  y_scale: [{
      name: "linear",
      func: d3.scale.linear()
            .domain([0, nb_dimension])
            .range([0, vars.height])
    }
  ],

  items: [{
    attr: "name",
    marks: [{
      type: "diamond",
      rotate: "0"
    },{
      type: "text",
      rotate: "-30"
    }]
  }],

  connect: [],

  var_x: "x",
  var_y: "y",

  x_axis_show: false,
  y_axis_show: false
};

vars.default_params["sparkline"] = function(scope) {

  var params = {};
  params.accessor_values = function(d) { return d.values; };

  params.x_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.margin.left, scope.width - scope.margin.left - scope.margin.right])
            .domain(scope.time.interval)
  }];

  params.y_scale = [{
    name: "linear",
    func: d3.scale.linear()
            .range([scope.height - scope.margin.top - scope.margin.bottom, scope.margin.top])
            .domain(d3.extent(scope.new_data, function(d) { return d[scope.var_y]; }))
  }];

  params.items = [{
    attr: "year",
    marks: [{
        type: "circle",
        rotate: "0",
      }, {
        type: "text",
        rotate: "30"
      }]
  }];

  params.connect = [{
    attr: scope.time.var_time,
    marks: [{
        type: "path",
        rotate: "0",
        stroke: function(d) { return "black"; },
        func: d3.svg.line()
             .interpolate(scope.interpolate)
             .x(function(d) { return params.x_scale[0]["func"](d[scope.var_x]); })
             .y(function(d) { return params.y_scale[0]["func"](d[scope.var_y]); }),
      }]
  }];

  params.x_axis_show = false;

  params.y_axis_show = false;

  return params;

};

// TODO: clone sparkline
// vars.default_params["linechart"] = vars.default_params["sparkline"];

vars.default_params["linechart"] = {

  accessor_values: function(d) { return d.values; },

  x_scale: [{
      name: "linear",
      func: d3.scale.linear()
              .range([vars.margin.left, vars.width - vars.margin.left - vars.margin.right])
              .domain(vars.time.interval)
  }],

  y_scale: [{
      name: "linear",
      func: d3.scale.linear()
              .range([vars.height - vars.margin.top - vars.margin.bottom, vars.margin.top])
              .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; }))
  }],

  items: [{
    attr: "year",
    marks: [{
        type: "diamond",
        rotate: "0",
      }, {
        type: "text",
        rotate: "30"
      }]
  }],

  connect: [{
    attr: vars.time.var_time,
    marks: [{
        type: "path",
        rotate: "0",
        stroke: function(d) { return "black"; },
        func: d3.svg.line()
             .interpolate(vars.interpolate)
             .x(function(d) { return vars.x_scale[0]["func"](d[vars.var_x]); })
             .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); }),
      }]
  }],

  x_ticks: vars.time.points.length,
//  x_format: d3.time.format("%Y"),
  x_tickValues: null,
  x_axis_orient: "top",
  x_axis_show: false,
  x_grid_show: true,

  y_axis_show: false,
  y_grid_show: true,
};


vars.default_params["linechart"].items = [{
    attr: "name",
    marks: [{
      type: "circle",
      rotate: "0",
      fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
    },{
      type: "text",
      rotate: "0"
    }]
  }]

vars.default_params["linechart"].connect[0].marks[0].stroke = function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); };
vars.default_params["linechart"].x_axis_show = true;

// TODO
// Sequence of vertical dotplots in an horizontal layout
// Connected with lines
vars.default_params["parallel_coordinates"] = vars.default_params["dotplot"];

vars.default_params["splot_graph"] = {

  layout: null // Should be a X axis

};
