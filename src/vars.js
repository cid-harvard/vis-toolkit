  if(typeof nb_viz === "undefined") {
    nb_viz = 0;
    global = {};
    global.evt = [];
  }

  // Contains parameters for the current chart
  vars = {};

  // Default parameters for all charts
  var default_vars = {
    // PUBLIC (set by the user)
    container : "",
    this_chart: null,

    new_data: null,
    time_data: null,

    dev : true,
    id : "id",
    id_var : "id",
    var_group: null,
    data: [],
    links: [],
    title: "",
    
    focus: [],
    selection: [],
    filter: [],

    type: "",

    // Default dimensions
    margin: {top: 10, right: 10, bottom: 10, left: 10},

    // Default Variables mapping
    var_text: "name",
    var_color: null,

    // Interaction
    highlight: [],
    selection: [],
    filter: [],
    aggregate: [],

    time: {
      var_time: null, 
      current_time: null,
      parse: function(d) { return d; }
    },

    // TABLE
    columns: [],
    sort_by: {'column': 'name', 'asc': true},

    // DOTPLOT
    x_type: "linear",
    x_scale: [],
    x_ticks: 5,
    x_axis: null,
    x_format: function(d) { return d; },
    x_tickValues: null,
    x_axis_show: true,
    x_axis_orient: "bottom",
    x_grid_show: true,
    x_text: true,


    // SCATTERPLOT (INCLUDES DOTPLOT)
    y_type: "linear",
    y_scale: [],
    y_ticks: 5,
    y_axis: null,
    y_format: function(d) { return d; },
    y_tickSize: 10,
    y_tickPadding: 0,
    y_tickValues: null,
    y_axis_show: true,
    y_grid_show: true,
    y_text: true,

    r_scale: null,
    r_cutoff: function(d) { return d > 30; },

    tickSize: 10,
    tickPadding: 0,

    // Automatically generate UI elements
    ui: true,

    // Graphical properties for graphical marks
    color: d3.scale.category20c(),
    size: d3.scale.linear(),

    dispatch: [],
    evt: {register: function() {}, call: function() {} },  

    // SVG Container
    svg: null,
    ratio: 0.5, // Visualization aspect ratio

    duration: 1000,
    interpolate: "monotone",

    padding: 5,

    radius: 5,

    mark: {
      height: 10,
      width: 10,
      rotate: 0,
      radius: 5,
      fill: function(d) { return vars.color(vars.accessor_values(d)[vars.var_color]); }
    },

    accessor_values: function(d) { return d; },
    accessor_data: function(d) { return d; },
    accessor_items: function(d) { return d; },

    container: "#viz",
    nb_viz: nb_viz,

    _user_vars: {}
  };

  vars = vistk.utils.merge(vars, default_vars);

  vars.evt.register = function(evt, f, d) {

    if(vars.dev) { console.log("[vars.evt.register]", evt); }

    if(typeof evt === "string") {
      evt = [evt];
    }

    evt.forEach(function(e) {
      if(typeof global.evt[e] === "undefined") {
        global.evt[e] = [];
      }
      
      global.evt[e].push([f,d]);
    });
  };

  vars.evt.call = function(evt, a) {

    if(vars.dev) { console.log("[vars.evt.call]", evt, a); }

    if(typeof global.evt[evt] === "undefined") {
      if(vars.dev) { console.warn("No callback for event", evt, a); }
      return;
    }

    global.evt[evt].forEach(function(e) {
      if(global.dev) { console.log("[calling evt]", e); }
      if(typeof(e[0]) !== "undefined") {
        e[0](a);
      }
    });
  };
  
  nb_viz++;

  if (!vars.data) { vars.data = []; }

  vars.width = parseInt(d3.select("body").style('width').substring(0, d3.select("body").style('width').length-2));
  vars.width = vars.width - vars.margin.left - vars.margin.right;
  vars.height = vars.width * vars.ratio;

  // List of events 
  vars.dispatch = d3.dispatch('init', 'end', 'highlightOn', 'highlightOut', 'selection', 'resize', 'clearAnimations');

  // Default events
  d3.select(window).on('resize', function(d) { 
    vars.evt.call("resize", d);
  });

  vars.evt.register("highlightOn", function(d) {
    d.__highlighted = true;
    if(vars.type !== "treemap")
      d3.select(vars.container).call(vars.this_chart);
  });

  vars.evt.register("highlightOut", function(d) {
    d.__highlighted = false;
    if(vars.type !== "treemap")
      d3.select(vars.container).call(vars.this_chart);
  });

  vars.evt.register("selection", function(d) {
    d.__selected = !d.__selected;
    if(vars.type !== "treemap")
      d3.select(vars.container).call(vars.this_chart);
  });
