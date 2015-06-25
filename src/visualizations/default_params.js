vars.default_params = {};

vars.default_params.basic = {};
vars.default_params.composite = {};
vars.default_params.custom = {};

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

// Similar to scatterplot
vars.default_params["productspace"] = {

  x_scale: [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
            .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_x]; })).nice()
  }],

  y_scale: [{
    name: "linear",
    func: d3.scale.linear()
            .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
            .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; })).nice(),
  }],

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
  }],

  connect: [{
    attr: "links",
    type: "items",
    marks: [{
      type: "line",
      rotate: "0",
      func: null,
    }]
  }],

  x_axis_show: false,
  x_grid_show: false,
  
  y_axis_show: false,
  y_grid_show: false
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
            .rangeBands([vars.margin.left, vars.width - vars.margin.left - vars.margin.right])
  }],

  items: [{
    attr: "name",
    marks: [{
      type: "circle",
      rotate: "0",
    },{
      type: "text",
      rotate: "0"
    }]
  }],

  connect: [],

  x_axis_show: false,

  y_axis_show: false
};

vars.default_params["horizontal_ordinal"] = {

  x_scale: [{
    func: d3.scale.ordinal()
            .domain(d3.set(vars.new_data.map(function(d) { return d[vars.var_x]; })).values())
            .rangeBands([vars.margin.left, vars.width - vars.margin.left - vars.margin.right]),

  }],

  y_scale: [{
    func: d3.scale.linear()
            .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })])
            .range([vars.height/2, vars.height/2])
            .nice()
  }],

  items: [{
    attr: "name",
    marks: [{
      type: "circle",
      rotate: "0",
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

// Duplicating line chart configuration
vars.default_params["slopegraph"] = {

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
              .domain(d3.extent(Array.prototype.concat.apply([], vars.new_data.map(function(d) { return d.values; }) ), function(d) { return d[vars.var_y]; }))
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
  x_tickValues: vars.time.interval,
  x_axis_orient: "top",
  x_axis_show: true,
  x_grid_show: false,
  x_text: false,

  y_axis_show: false,
  y_grid_show: false,
};

vars.default_params["slopegraph"].items = [{
  attr: "name",
  marks: [{
    type: "rect",
    rotate: "0",
    fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
  },{
    type: "text", // Text on the right (newest)
    rotate: "0"
  },{
    type: "text", // Text on the left (oldest)
    rotate: "0",
    text_anchor: "end",
    translate: [-(vars.width-vars.margin.left-vars.margin.right-vars.margin.left+20), 0]
  }],

}]

vars.default_params["stacked"] = {

  accessor_values: function(d) { return d.values; },
  accessor_items: function(d) { return d; },

  x_scale: [{
      name: "linear",
      func: d3.time.scale()
              .range([vars.margin.left, vars.width - vars.margin.left - vars.margin.right])
              .domain(vars.time.interval)
    }
  ],

  y_scale: [{
      name: "linear",
      func: d3.scale.linear()
              .range([vars.margin.top, vars.height - vars.margin.top - vars.margin.bottom])
              .domain(d3.extent(Array.prototype.concat.apply([], vars.new_data.map(function(d) { return d.values; }) ), function(d) { return d[vars.var_y]; }))
    }
  ],

  items: [],

  connect: [{
    attr: vars.time.var_time,
    marks: [{
        type: "path",
        rotate: "0",
        fill: function(d) { return vars.color(d[vars.var_color]); },
        stroke: function(d) {
          return vars.color(vars.accessor_items(d)[vars.var_color]); 
        },
        func: d3.svg.area()
                .interpolate('cardinal')
                .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
                .y0(function(d) { return vars.y_scale[0]["func"](d.y0); })
                .y1(function(d) { return vars.y_scale[0]["func"](d.y0 + d.y); })
      }]
  }],

  x_axis_show: true,
  x_axis_translate: [0, vars.height - vars.margin.bottom - vars.margin.top],
  x_grid_show: true,
  x_ticks: vars.time.points.length,
  x_format: d3.time.format("%Y"),
  x_text: false,
  
  y_axis_show: true,
  y_axis_translate: [vars.margin.left, 0],
  y_grid_show: true
};
