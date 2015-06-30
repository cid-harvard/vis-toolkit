
  // Default parameters for all charts
  var default_vars = {
    // PUBLIC (set by the user)
    container : "",
    this_chart: null,

    new_data: null,
    time_data: null,

    dev : false,
    id : "id",
    id_var : "id",
    var_group: null,
    data: [],
    links: [],
    title: "",
    
    focus: [],
    selection: [],
    filter: [],
    zoom: [],
    
    type: "",

    // Default dimensions
    margin: {top: 10, right: 10, bottom: 10, left: 10},

    // Default Variables mapping
    var_text: "name",
    var_color: null,
    var_sort_asc: false,

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
    x_axis_show: false,
    x_axis_orient: "bottom",
    x_grid_show: false,
    x_text: true,
    x_axis_translate: [0, 0],

    // SCATTERPLOT (INCLUDES DOTPLOT)
    y_type: "linear",
    y_scale: [],
    y_ticks: 5,
    y_axis: null,
    y_format: function(d) { return d; },
    y_tickSize: 10,
    y_tickPadding: 0,
    y_tickValues: null,
    y_axis_show: false,
    y_grid_show: false,
    y_text: true,
    y_axis_translate: [0, 0],

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

    padding: 2,

    radius: 5,

    radius_min: 2,
    radius_max: 10,

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
    countries: [],

    _user_vars: {}
  };

  vars = vistk.utils.merge(vars, default_vars);

