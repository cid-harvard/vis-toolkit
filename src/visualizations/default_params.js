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

  y_axis_show: false
};

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

vars.default_params["sparkline"] = {

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
        rotate: "30",
        translate: null
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

  x_axis_show: false,

  y_axis_show: false
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
        rotate: "30",
        translate: null
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

  x_axis_show: false,

  y_axis_show: false
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
