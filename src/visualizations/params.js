vars.params = {};

vars.params.basic = {};
vars.params.composite = {};
vars.params.custom = {};

// TODO
// There should be an abstract version of the dotplot
// And then decide weither it is horizontal or vertical
vars.params["dotplot"] = {
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

  y_scale: [],

  items: [{
    type: "diamond",
    rotate: "0"
  },{
    type: "text",
    rotate: "-30"
  }],

  connect: [],

  axes: [
    {type: "x",
     scale: null}
  ],

  x_tickValues: [0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })]

};

// TODO
// Add all the required parameters to change that
vars.params["dotplot_horizontal"] = vars.params["dotplot"];
vars.params["dotplot_vertical"] = vars.params["dotplot"];

vars.params["sparkline"] = {

  accessor_values: function(d) { return d.values; },

  x_scale: [{
      name: "linear",
      func: d3.scale.linear()
              .range([0, vars.width - 2])
              .domain(d3.extent(vars.new_data, function(d) { return d[vars.time.var_time]; }))
  }],

  y_scale: [{
      name: "linear",
      func: d3.scale.linear()
              .range([vars.height - 4, 0])
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
        func: d3.svg.line()
             .interpolate(vars.interpolate)
             .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
             .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); }),
      }]
  }]

};

// TODO
// Sequence of vertical dotplots in an horizontal layout
// Connected with lines
vars.params["parallel_coordinates"] = vars.params["dotplot"];


vars.params["splot_graph"] = {

  layout: null // Should be a X axis

};
