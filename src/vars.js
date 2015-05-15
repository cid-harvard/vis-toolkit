
  if(typeof nb_viz === "undefined") {
    nb_viz = 0;
    global = {};
    global.evt = [];
  }

  // Parameters for the visualization
  vars = {
    // PUBLIC (set by the user)
    container : "",
    dev : true,
    id : "id",
    id_var : "id",
    var_group: null,
    data: [],
    links: [],
    title: null,
    focus: [],
    nesting: null,
    nesting_aggs: {},
    type: "",

    // Default dimensions
    width: 1000,
    height: 600,
    margin: {top: 30, right: 20, bottom: 10, left: 30},

    // Default Variables mapping
    var_text: "name",
    var_color: null,

    // Interaction
    highlight: [],
    selection: [],
    filter: [],
    aggregate: [],
    current_time: null,

    // TABLE
    columns: [],
    sort_by: {'column': 'name', 'asc': true},

    // DOTPLOT
    x_type: "linear",
    x_scale: null,
    x_ticks: 5,
    x_axis: null,

    // SCATTERPLOT (INCLUDES DOTPLOT)
    y_type: "linear",
    y_scale: null,
    y_ticks: 5,
    y_axis: null,

    // Automatically generate UI elements
    ui: true,

    // Graphical properties for graphical marks
    color: d3.scale.category20c(),
    size: d3.scale.linear(),

    accessor_year: function(d) { return d; },

    dispatch: [],
    evt: {register: function() {}, call: function() {}},  

    // SVG Container
    svg: null,

    nb_viz: nb_viz
  };

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

  if (vars.dev) { console.log("Init"); }

  if (!vars.data) { vars.data = []; }

  // Calculate new dimensions based on margins
  vars.width = vars.width - vars.margin.left - vars.margin.right;
  vars.height = vars.height - vars.margin.top - vars.margin.bottom;

  // Events 
  vars.dispatch = d3.dispatch("init", "end", "highlightOn", "highlightOut", "selection");