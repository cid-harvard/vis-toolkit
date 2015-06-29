vars.default_params = {};

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


